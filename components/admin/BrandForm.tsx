"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RefreshCcw, AlertCircle, Trash2, Upload, X } from "lucide-react";
import { createBrand, updateBrand, deleteBrand, type BrandInput } from "@/app/actions/admin";
import { slugify } from "@/lib/utils";

type Props = {
  initial?: { id: string; name: string; slug: string; logoUrl?: string | null };
};

export function BrandForm({ initial }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDelete] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(!!initial?.slug);

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [logoUrl, setLogoUrl] = useState(initial?.logoUrl ?? "");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!slugEdited && name) setSlug(slugify(name));
  }, [name, slugEdited]);

  async function handleFileChange(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError(null);

    // Aperçu immédiat
    const preview = URL.createObjectURL(file);
    setLogoUrl(preview);

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/admin/upload?bucket=brands", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      URL.revokeObjectURL(preview);
      setLogoUrl(data.url as string);
    } catch (err) {
      setError(`Erreur upload : ${err instanceof Error ? err.message : "inconnue"}`);
      URL.revokeObjectURL(preview);
      setLogoUrl("");
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !slug.trim()) {
      setError("Nom et slug sont obligatoires.");
      return;
    }

    const data: BrandInput = {
      name: name.trim(),
      slug: slug.trim(),
      logoUrl: logoUrl.trim() || undefined,
    };

    startTransition(async () => {
      const result = initial?.id
        ? await updateBrand(initial.id, data)
        : await createBrand(data);

      if (result.error) { setError(result.error); return; }
      router.push("/admin/brands");
      router.refresh();
    });
  }

  function handleDelete() {
    if (!initial?.id) return;
    if (!confirm(`Supprimer la marque « ${initial.name} » ? Cette action est irréversible.`)) return;

    startDelete(async () => {
      const result = await deleteBrand(initial.id);
      if (result.error) { setError(result.error); return; }
      router.push("/admin/brands");
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

      {/* Informations */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-[14px] font-bold">Informations</h2>

        <div>
          <label className={labelClass}>
            Nom de la marque <span className="text-brand-orange">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex : Babybol"
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
            placeholder="babybol"
            className={`${fieldClass} font-mono text-[12px]`}
          />
          <p className="text-[11px] text-gray-400 mt-1">
            Généré automatiquement depuis le nom. Modifier avec précaution.
          </p>
        </div>
      </section>

      {/* Logo */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-[14px] font-bold">Logo</h2>

        {logoUrl ? (
          /* Logo uploadé — aperçu + actions */
          <div className="flex items-center gap-4">
            <div className="relative shrink-0 w-32 h-20 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt=""
                className="w-full h-full object-contain p-3"
              />
              {uploading && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                  <RefreshCcw size={18} className="animate-spin text-brand-orange" />
                </div>
              )}
              {!uploading && (
                <button
                  type="button"
                  onClick={() => setLogoUrl("")}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X size={11} className="text-white" />
                </button>
              )}
            </div>

            {!uploading && (
              <label className="inline-flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl border border-gray-200 text-[12px] font-semibold text-gray-600 hover:bg-gray-50 hover:border-brand-orange hover:text-brand-orange transition-colors">
                <Upload size={13} />
                Remplacer
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                />
              </label>
            )}
          </div>
        ) : (
          /* Zone de dépôt / upload */
          <label className="flex flex-col items-center justify-center gap-3 w-full h-36 rounded-xl border-2 border-dashed border-gray-200 hover:border-brand-orange hover:bg-brand-orange/5 transition-colors cursor-pointer group">
            {uploading ? (
              <RefreshCcw size={22} className="animate-spin text-brand-orange" />
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-brand-orange/10 flex items-center justify-center transition-colors">
                  <Upload size={18} className="text-gray-400 group-hover:text-brand-orange transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-semibold text-gray-600 group-hover:text-brand-orange transition-colors">
                    Cliquer pour choisir un fichier
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    PNG, SVG ou JPG — fond transparent recommandé
                  </p>
                </div>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            />
          </label>
        )}
      </section>

      {/* Actions */}
      <div className="flex items-center justify-between pb-4">
        {initial?.id ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 text-[12px] font-semibold text-red-400 hover:text-red-600 transition-colors"
          >
            <Trash2 size={13} />
            {isDeleting ? "Suppression…" : "Supprimer cette marque"}
          </button>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isPending || uploading}
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors disabled:opacity-50"
          >
            {isPending && <RefreshCcw size={13} className="animate-spin" />}
            {initial?.id ? "Enregistrer" : "Créer la marque"}
          </button>
        </div>
      </div>
    </form>
  );
}
