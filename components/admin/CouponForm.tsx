"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCcw, AlertCircle, Trash2 } from "lucide-react";
import { createCoupon, updateCoupon, deleteCoupon, type CouponInput } from "@/app/actions/coupon";

type Props = {
  initial?: {
    id: string;
    code: string;
    description?: string | null;
    discountType: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
    discountValue: number;
    minSubtotal?: number | null;
    maxUses?: number | null;
    startsAt?: Date | null;
    expiresAt?: Date | null;
    isActive: boolean;
  };
};

function toDateInput(d?: Date | null) {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 16);
}

const DISCOUNT_TYPES = [
  { value: "PERCENTAGE",   label: "Pourcentage (%)" },
  { value: "FIXED_AMOUNT", label: "Montant fixe (F CFA)" },
  { value: "FREE_SHIPPING", label: "Livraison offerte" },
] as const;

export function CouponForm({ initial }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDelete]   = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [code, setCode]               = useState(initial?.code ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [discountType, setDiscountType] = useState<CouponInput["discountType"]>(
    initial?.discountType ?? "PERCENTAGE"
  );
  const [discountValue, setDiscountValue] = useState(String(initial?.discountValue ?? ""));
  const [minSubtotal, setMinSubtotal]     = useState(String(initial?.minSubtotal ?? ""));
  const [maxUses, setMaxUses]             = useState(String(initial?.maxUses ?? ""));
  const [startsAt, setStartsAt]           = useState(toDateInput(initial?.startsAt));
  const [expiresAt, setExpiresAt]         = useState(toDateInput(initial?.expiresAt));
  const [isActive, setIsActive]           = useState(initial?.isActive ?? true);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!code.trim()) { setError("Le code est obligatoire."); return; }
    if (discountType !== "FREE_SHIPPING" && !discountValue) {
      setError("La valeur de la remise est obligatoire.");
      return;
    }

    const data: CouponInput = {
      code: code.trim().toUpperCase(),
      description: description.trim() || undefined,
      discountType,
      discountValue: Number(discountValue) || 0,
      minSubtotal: parseInt(minSubtotal) || undefined,
      maxUses: parseInt(maxUses) || undefined,
      startsAt: startsAt || undefined,
      expiresAt: expiresAt || undefined,
      isActive,
    };

    startTransition(async () => {
      const result = initial?.id
        ? await updateCoupon(initial.id, data)
        : await createCoupon(data);

      if (result.error) { setError(result.error); return; }
      router.push("/admin/coupons");
      router.refresh();
    });
  }

  function handleDelete() {
    if (!initial?.id) return;
    if (!confirm(`Supprimer le code « ${initial.code} » ?`)) return;
    startDelete(async () => {
      const result = await deleteCoupon(initial.id);
      if (result.error) { setError(result.error); return; }
      router.push("/admin/coupons");
      router.refresh();
    });
  }

  const fieldClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-brand-orange transition-colors placeholder:text-gray-300";
  const labelClass = "block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <AlertCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
          <p className="text-[13px] text-red-600">{error}</p>
        </div>
      )}

      {/* Code & statut */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-[14px] font-bold">Code promo</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Code <span className="text-brand-orange">*</span></label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="KIDS15"
              className={`${fieldClass} font-mono tracking-widest`}
            />
          </div>
          <div className="flex flex-col justify-end pb-0.5">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-10 h-6 rounded-full transition-colors relative shrink-0 ${isActive ? "bg-brand-orange" : "bg-gray-200"}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${isActive ? "left-5" : "left-1"}`} />
              </button>
              <span className="text-[12px] font-semibold">Code actif</span>
            </label>
          </div>
        </div>
        <div>
          <label className={labelClass}>Description (affichée aux clients)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="−15% sur votre première commande"
            className={fieldClass}
          />
        </div>
      </section>

      {/* Remise */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-[14px] font-bold">Remise</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Type de remise <span className="text-brand-orange">*</span></label>
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as CouponInput["discountType"])}
              className={fieldClass}
            >
              {DISCOUNT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          {discountType !== "FREE_SHIPPING" && (
            <div>
              <label className={labelClass}>
                Valeur {discountType === "PERCENTAGE" ? "(%)" : "(F CFA)"}
                <span className="text-brand-orange"> *</span>
              </label>
              <input
                type="number"
                min={0}
                max={discountType === "PERCENTAGE" ? 100 : undefined}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder={discountType === "PERCENTAGE" ? "15" : "5000"}
                className={fieldClass}
              />
            </div>
          )}
        </div>
        <div>
          <label className={labelClass}>Sous-total minimum (F CFA)</label>
          <input
            type="number"
            min={0}
            value={minSubtotal}
            onChange={(e) => setMinSubtotal(e.target.value)}
            placeholder="Laissez vide si aucun minimum"
            className={fieldClass}
          />
        </div>
      </section>

      {/* Validité */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-[14px] font-bold">Validité</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Début</label>
            <input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Expiration</label>
            <input type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className={fieldClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Nombre max d'utilisations</label>
          <input
            type="number"
            min={1}
            value={maxUses}
            onChange={(e) => setMaxUses(e.target.value)}
            placeholder="Laissez vide pour illimité"
            className={fieldClass}
          />
        </div>
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
            {isDeleting ? "Suppression…" : "Supprimer ce code"}
          </button>
        ) : <span />}
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Annuler
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors disabled:opacity-50"
          >
            {isPending && <RefreshCcw size={13} className="animate-spin" />}
            {initial?.id ? "Enregistrer" : "Créer le code"}
          </button>
        </div>
      </div>
    </form>
  );
}
