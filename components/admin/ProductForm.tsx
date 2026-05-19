"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, RefreshCcw, AlertCircle, Upload, X } from "lucide-react";
import { createProduct, updateProduct, type ProductInput } from "@/app/actions/admin";
import { slugify } from "@/lib/utils";

type Category = { id: string; name: string };
type Brand = { id: string; name: string };
type Variant = {
  size: string;
  color: string;
  sku: string;
  stock: number;
  priceOverride: string;
};
type ImageRow = {
  url: string;
  alt: string;
  uploading: boolean;
  dominantColor?: string;
};

type Props = {
  categories: Category[];
  brands: Brand[];
  initial?: Partial<ProductInput> & {
    id?: string;
    variants?: (Omit<Variant, "stock" | "priceOverride"> & {
      stock: number;
      priceOverride?: number | null;
    })[];
    images?: { url: string; alt?: string | null }[];
  };
};

const GENDER_OPTIONS = [
  { value: "UNISEX", label: "Mixte" },
  { value: "GIRL", label: "Fille" },
  { value: "BOY", label: "Garçon" },
];

const emptyVariant = (): Variant => ({
  size: "",
  color: "",
  sku: "",
  stock: 0,
  priceOverride: "",
});

// Extrait la couleur dominante d'un fichier image via Canvas.
// Ignore les pixels gris/blanc/noir (fond) pour cibler la couleur du vêtement.
async function extractDominantColor(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const size = 60;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) { URL.revokeObjectURL(objectUrl); resolve(""); return; }

      ctx.drawImage(img, 0, 0, size, size);
      const { data } = ctx.getImageData(0, 0, size, size);
      URL.revokeObjectURL(objectUrl);

      const buckets: Record<string, number> = {};
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 128) continue; // transparent
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        // Ignorer blanc (max > 230 et min > 200), noir (max < 40) et gris (faible saturation)
        if (max < 40) continue;
        if (max > 230 && min > 200) continue;
        const sat = max === 0 ? 0 : (max - min) / max;
        if (sat < 0.2) continue;
        // Quantiser en seaux de 32
        const qr = Math.round(r / 32) * 32;
        const qg = Math.round(g / 32) * 32;
        const qb = Math.round(b / 32) * 32;
        const key = `${qr},${qg},${qb}`;
        buckets[key] = (buckets[key] ?? 0) + 1;
      }

      const entries = Object.entries(buckets);
      if (entries.length === 0) { resolve(""); return; }
      const [topKey] = entries.sort((a, b) => b[1] - a[1]);
      const [r, g, b] = topKey[0].split(",").map(Number);
      const hex = (v: number) => Math.min(255, v).toString(16).padStart(2, "0");
      resolve(`#${hex(r)}${hex(g)}${hex(b)}`);
    };

    img.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(""); };
    img.src = objectUrl;
  });
}

export function ProductForm({ categories, brands, initial }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(!!initial?.slug);

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [brandId, setBrandId] = useState(initial?.brandId ?? "");
  const [basePrice, setBasePrice] = useState(String(initial?.basePrice ?? ""));
  const [comparePrice, setComparePrice] = useState(String(initial?.comparePrice ?? ""));
  const [gender, setGender] = useState(initial?.gender ?? "UNISEX");
  const [ageRangeMin, setAgeRangeMin] = useState(String(initial?.ageRangeMin ?? ""));
  const [ageRangeMax, setAgeRangeMax] = useState(String(initial?.ageRangeMax ?? ""));
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false);

  const [variants, setVariants] = useState<Variant[]>(
    initial?.variants?.map((v) => ({
      size: v.size,
      color: v.color ?? "",
      sku: v.sku,
      stock: v.stock,
      priceOverride: v.priceOverride != null ? String(v.priceOverride) : "",
    })) ?? [emptyVariant()]
  );

  const [images, setImages] = useState<ImageRow[]>(
    initial?.images?.map((img) => ({
      url: img.url,
      alt: img.alt ?? "",
      uploading: false,
    })) ?? []
  );

  useEffect(() => {
    if (!slugEdited && name) setSlug(slugify(name));
  }, [name, slugEdited]);

  function updateVariant(i: number, field: keyof Variant, value: string | number) {
    setVariants((prev) =>
      prev.map((v, idx) => (idx === i ? { ...v, [field]: value } : v))
    );
  }

  async function handleFileChange(i: number, file: File | null) {
    if (!file) return;

    // Aperçu immédiat + état uploading
    const previewUrl = URL.createObjectURL(file);
    setImages((prev) =>
      prev.map((img, idx) =>
        idx === i ? { ...img, url: previewUrl, uploading: true } : img
      )
    );

    // Extraction de couleur dominante
    const color = await extractDominantColor(file);

    // Upload vers Supabase Storage
    const form = new FormData();
    form.append("file", file);

    let publicUrl = "";
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      publicUrl = data.url as string;
    } catch (err) {
      setError(`Erreur upload : ${err instanceof Error ? err.message : "inconnue"}`);
      URL.revokeObjectURL(previewUrl);
      setImages((prev) =>
        prev.map((img, idx) => (idx === i ? { ...img, url: "", uploading: false } : img))
      );
      return;
    }

    URL.revokeObjectURL(previewUrl);

    // Appliquer la couleur à toutes les variantes sans couleur si c'est la première image
    if (color) {
      setVariants((prev) => {
        const anyHasColor = prev.some((v) => v.color.trim());
        if (anyHasColor) return prev;
        return prev.map((v) => ({ ...v, color }));
      });
    }

    setImages((prev) =>
      prev.map((img, idx) =>
        idx === i
          ? { url: publicUrl, alt: img.alt, uploading: false, dominantColor: color || undefined }
          : img
      )
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const validVariants = variants.filter((v) => v.size.trim() && v.sku.trim());
    const validImages = images
      .filter((img) => img.url && !img.uploading)
      .map((img, i) => ({ url: img.url, alt: img.alt || undefined, position: i }));

    const data: ProductInput = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || undefined,
      categoryId,
      brandId: brandId || undefined,
      basePrice: parseInt(basePrice) || 0,
      comparePrice: parseInt(comparePrice) || undefined,
      gender,
      ageRangeMin: parseInt(ageRangeMin) || undefined,
      ageRangeMax: parseInt(ageRangeMax) || undefined,
      isActive,
      isFeatured,
      variants: validVariants.map((v) => ({
        size: v.size.trim(),
        color: v.color.trim() || undefined,
        sku: v.sku.trim(),
        stock: Number(v.stock) || 0,
        priceOverride: parseInt(v.priceOverride) || undefined,
      })),
      images: validImages,
    };

    if (!data.name || !data.slug || !data.categoryId || !data.basePrice) {
      setError("Nom, slug, catégorie et prix de base sont obligatoires.");
      return;
    }

    startTransition(async () => {
      const result = initial?.id
        ? await updateProduct(initial.id, data)
        : await createProduct(data);

      if (result.error) { setError(result.error); return; }

      if ("id" in result && result.id) {
        router.push(`/admin/products/${result.id}`);
      } else {
        router.push("/admin/products");
      }
      router.refresh();
    });
  }

  const fieldClass =
    "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-brand-orange transition-colors placeholder:text-gray-300";
  const labelClass =
    "block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <AlertCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
          <p className="text-[13px] text-red-600">{error}</p>
        </div>
      )}

      {/* Informations générales */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-[14px] font-bold">Informations générales</h2>

        <div>
          <label className={labelClass}>
            Nom du produit <span className="text-brand-orange">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex : Robe liberty à smocks"
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Slug URL <span className="text-brand-orange">*</span>
          </label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }}
            placeholder="robe-liberty-a-smocks"
            className={`${fieldClass} font-mono text-[12px]`}
          />
          <p className="text-[11px] text-gray-400 mt-1">
            Généré automatiquement depuis le nom. Modifier avec précaution.
          </p>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description détaillée du produit…"
            rows={4}
            className={`${fieldClass} resize-none`}
          />
        </div>
      </section>

      {/* Prix */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-[14px] font-bold">Prix</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Prix de vente (F CFA) <span className="text-brand-orange">*</span>
            </label>
            <input
              type="number"
              required
              min={0}
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              placeholder="12500"
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass}>Prix barré (F CFA)</label>
            <input
              type="number"
              min={0}
              value={comparePrice}
              onChange={(e) => setComparePrice(e.target.value)}
              placeholder="15000"
              className={fieldClass}
            />
            <p className="text-[11px] text-gray-400 mt-1">Laissez vide si pas de promo.</p>
          </div>
        </div>
      </section>

      {/* Classification */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-[14px] font-bold">Classification</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Catégorie <span className="text-brand-orange">*</span>
            </label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={fieldClass}
            >
              <option value="">— Choisir —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Marque</label>
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className={fieldClass}
            >
              <option value="">— Aucune —</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Genre</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className={fieldClass}
            >
              {GENDER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Âge min (mois)</label>
            <input
              type="number"
              min={0}
              value={ageRangeMin}
              onChange={(e) => setAgeRangeMin(e.target.value)}
              placeholder="Ex : 24"
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass}>Âge max (mois)</label>
            <input
              type="number"
              min={0}
              value={ageRangeMax}
              onChange={(e) => setAgeRangeMax(e.target.value)}
              placeholder="Ex : 48"
              className={fieldClass}
            />
          </div>
        </div>

        <div className="flex items-center gap-6 pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-10 h-6 rounded-full transition-colors relative ${
                isActive ? "bg-brand-orange" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  isActive ? "left-5" : "left-1"
                }`}
              />
            </button>
            <span className="text-[12px] font-semibold">Produit actif (visible)</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <button
              type="button"
              onClick={() => setIsFeatured(!isFeatured)}
              className={`w-10 h-6 rounded-full transition-colors relative ${
                isFeatured ? "bg-brand-blue-dark" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  isFeatured ? "left-5" : "left-1"
                }`}
              />
            </button>
            <div>
              <span className="text-[12px] font-semibold">Afficher dans la vitrine accueil</span>
              <p className="text-[11px] text-gray-400 mt-0.5">Maximum 2 articles — visibles en page d&apos;accueil</p>
            </div>
          </label>
        </div>
      </section>

      {/* Images */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-bold">Images</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              La couleur dominante de la première image est appliquée automatiquement aux variantes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              {/* Vignette */}
              <div className="relative group aspect-[3/4] rounded-xl border-2 border-gray-100 overflow-hidden bg-gray-50">
                {img.url ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                    />
                    {img.uploading && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <RefreshCcw size={18} className="animate-spin text-brand-orange" />
                      </div>
                    )}
                    {!img.uploading && (
                      <button
                        type="button"
                        onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X size={11} className="text-white" />
                      </button>
                    )}
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center h-full cursor-pointer gap-1.5 text-gray-300 hover:text-brand-orange transition-colors">
                    <Upload size={20} />
                    <span className="text-[10px] font-bold uppercase tracking-wide">
                      Choisir
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(i, e.target.files?.[0] ?? null)}
                    />
                  </label>
                )}
              </div>

              {/* Couleur détectée */}
              {img.dominantColor && (
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-gray-200 shrink-0"
                    style={{ background: img.dominantColor }}
                  />
                  <span className="text-[10px] font-mono text-gray-400">
                    {img.dominantColor}
                  </span>
                </div>
              )}

              {/* Alt text */}
              {img.url && !img.uploading && (
                <input
                  type="text"
                  placeholder="Description…"
                  value={img.alt}
                  onChange={(e) =>
                    setImages((prev) =>
                      prev.map((row, idx) =>
                        idx === i ? { ...row, alt: e.target.value } : row
                      )
                    )
                  }
                  className="w-full border border-gray-200 rounded-lg px-2 py-1 text-[11px] outline-none focus:border-brand-orange"
                />
              )}
            </div>
          ))}

          {/* Slot d'ajout */}
          <button
            type="button"
            onClick={() =>
              setImages((prev) => [...prev, { url: "", alt: "", uploading: false }])
            }
            className="aspect-[3/4] rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1.5 text-gray-300 hover:border-brand-orange hover:text-brand-orange transition-colors"
          >
            <Plus size={20} />
            <span className="text-[10px] font-bold uppercase tracking-wide">
              Ajouter
            </span>
          </button>
        </div>
      </section>

      {/* Variantes */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-bold">
            Variantes
            <span className="ml-2 text-[11px] text-gray-400 font-normal">
              taille, couleur, stock
            </span>
          </h2>
          <button
            type="button"
            onClick={() => setVariants((prev) => [...prev, emptyVariant()])}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand-orange hover:text-black transition-colors"
          >
            <Plus size={13} /> Ajouter
          </button>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_1fr_1.5fr_80px_100px_32px] gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
            <span>Taille</span>
            <span>Couleur</span>
            <span>SKU</span>
            <span>Stock</span>
            <span>Prix spécial</span>
            <span />
          </div>
          {variants.map((v, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_1fr_1.5fr_80px_100px_32px] gap-2 items-center"
            >
              <input
                type="text"
                placeholder="2 ans"
                value={v.size}
                onChange={(e) => updateVariant(i, "size", e.target.value)}
                className={fieldClass}
              />
              {/* Couleur : swatch + input */}
              <div className="relative">
                {v.color && /^#[0-9a-fA-F]{6}$/.test(v.color) && (
                  <span
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-gray-200 pointer-events-none"
                    style={{ background: v.color }}
                  />
                )}
                <input
                  type="text"
                  placeholder="Rouge"
                  value={v.color}
                  onChange={(e) => updateVariant(i, "color", e.target.value)}
                  className={`${fieldClass} ${
                    v.color && /^#[0-9a-fA-F]{6}$/.test(v.color) ? "pl-9" : ""
                  }`}
                />
              </div>
              <input
                type="text"
                placeholder="KL-001-2A-R"
                value={v.sku}
                onChange={(e) => updateVariant(i, "sku", e.target.value)}
                className={`${fieldClass} font-mono text-[11px]`}
              />
              <input
                type="number"
                min={0}
                placeholder="0"
                value={v.stock}
                onChange={(e) => updateVariant(i, "stock", parseInt(e.target.value) || 0)}
                className={fieldClass}
              />
              <input
                type="number"
                min={0}
                placeholder="—"
                value={v.priceOverride}
                onChange={(e) => updateVariant(i, "priceOverride", e.target.value)}
                className={fieldClass}
              />
              <button
                type="button"
                onClick={() => setVariants((prev) => prev.filter((_, idx) => idx !== i))}
                className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 pb-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isPending || images.some((img) => img.uploading)}
          className="inline-flex items-center gap-2 bg-black text-white px-8 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors disabled:opacity-50"
        >
          {isPending && <RefreshCcw size={13} className="animate-spin" />}
          {initial?.id ? "Enregistrer" : "Créer le produit"}
        </button>
      </div>
    </form>
  );
}
