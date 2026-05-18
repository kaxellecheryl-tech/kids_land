"use client";

import { useState, useEffect } from "react";
import { X, Ruler } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "baby" | "child";

const BABY_SIZES = [
  { label: "0–3 mois",   height: "50–62 cm",   weight: "3–6 kg"   },
  { label: "3–6 mois",   height: "62–68 cm",   weight: "6–8 kg"   },
  { label: "6–9 mois",   height: "68–74 cm",   weight: "8–9 kg"   },
  { label: "9–12 mois",  height: "74–80 cm",   weight: "9–10 kg"  },
  { label: "12–18 mois", height: "80–86 cm",   weight: "10–12 kg" },
  { label: "18–24 mois", height: "86–92 cm",   weight: "12–13 kg" },
  { label: "2 ans",      height: "92–98 cm",   weight: "13–15 kg" },
  { label: "3 ans",      height: "98–104 cm",  weight: "15–17 kg" },
];

const CHILD_SIZES = [
  { label: "4 ans",  height: "104–110 cm", weight: "17–19 kg" },
  { label: "5 ans",  height: "110–116 cm", weight: "19–21 kg" },
  { label: "6 ans",  height: "116–122 cm", weight: "21–24 kg" },
  { label: "7 ans",  height: "122–128 cm", weight: "24–26 kg" },
  { label: "8 ans",  height: "128–134 cm", weight: "26–29 kg" },
  { label: "10 ans", height: "134–146 cm", weight: "29–36 kg" },
  { label: "12 ans", height: "146–158 cm", weight: "36–45 kg" },
  { label: "14 ans", height: "158–164 cm", weight: "45–55 kg" },
];

export function SizeGuideModal() {
  const [open, setOpen] = useState(false);
  const [tab, setTab]   = useState<Tab>("baby");

  // Fermer avec Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Bloquer le scroll quand ouvert
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const rows = tab === "baby" ? BABY_SIZES : CHILD_SIZES;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[12px] text-brand-orange font-medium hover:underline"
      >
        Guide des tailles
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Guide des tailles"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#fff3bb] flex items-center justify-center">
                  <Ruler size={15} className="text-gray-700" />
                </div>
                <h2 className="text-[15px] font-bold">Guide des tailles</h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              {([
                { key: "baby",  label: "Bébé & Tout-petit (0–3 ans)" },
                { key: "child", label: "Enfant (4–14 ans)" },
              ] as { key: Tab; label: string }[]).map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  className={cn(
                    "flex-1 py-3 text-[12px] font-bold transition-colors",
                    tab === key
                      ? "text-brand-orange border-b-2 border-brand-orange"
                      : "text-gray-500 hover:text-black"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-y-auto max-h-[60vh]">
              <table className="w-full text-[13px]">
                <thead className="sticky top-0 bg-gray-50 z-10">
                  <tr>
                    {["Taille", "Hauteur", "Poids"].map((h) => (
                      <th
                        key={h}
                        className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 px-6 py-3 first:w-28"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {rows.map((row) => (
                    <tr key={row.label} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-3 font-bold text-black">{row.label}</td>
                      <td className="px-6 py-3 text-gray-600">{row.height}</td>
                      <td className="px-6 py-3 text-gray-600">{row.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-[#FDF8F8] border-t border-gray-100">
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Ces mesures sont indicatives. En cas de doute entre deux tailles,
                préférez la taille supérieure. Les retours sont gratuits sous 30 jours.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
