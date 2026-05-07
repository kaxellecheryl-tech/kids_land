"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X, ArrowRight, Shirt } from "lucide-react";
import { searchProducts, type SearchResult } from "@/app/actions/search";
import { formatPrice } from "@/lib/utils";

interface SearchModalProps {
  onClose: () => void;
}

export function SearchModal({ onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isPending, startTransition] = useTransition();
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input on open
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(async () => {
        const res = await searchProducts(query);
        setResults(res);
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    router.push(`/products?q=${encodeURIComponent(query.trim())}`);
  }

  function handleResultClick(slug: string) {
    onClose();
    router.push(`/products/${slug}`);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un article, une marque…"
            className="flex-1 text-sm outline-none placeholder:text-gray-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); setResults([]); }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-[11px] font-medium border border-gray-200 rounded px-1.5 py-0.5"
          >
            Esc
          </button>
        </form>

        {/* Results */}
        {query.length >= 2 && (
          <div className="max-h-[420px] overflow-y-auto">
            {isPending && results.length === 0 && (
              <div className="py-10 text-center text-sm text-gray-400">Recherche…</div>
            )}

            {!isPending && results.length === 0 && (
              <div className="py-10 text-center">
                <Search size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Aucun résultat pour &ldquo;{query}&rdquo;</p>
              </div>
            )}

            {results.length > 0 && (
              <>
                <ul>
                  {results.map((p) => (
                    <li key={p.id}>
                      <button
                        onClick={() => handleResultClick(p.slug)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="w-12 h-12 rounded-md bg-[#F6E5E5] shrink-0 relative overflow-hidden">
                          {p.images[0]?.url && !imgErrors[p.id] ? (
                            <Image
                              src={p.images[0].url}
                              alt={p.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                              onError={() => setImgErrors((prev) => ({ ...prev, [p.id]: true }))}
                            />
                          ) : (
                            <span className="absolute inset-0 flex items-center justify-center"><Shirt size={20} className="text-gray-300" /></span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            {p.brand?.name ?? "Kids Land"}
                          </div>
                          <div className="text-sm font-semibold text-black truncate">{p.name}</div>
                          <div className="text-sm font-bold text-brand-orange">
                            {formatPrice(p.basePrice)}
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-gray-300 shrink-0" />
                      </button>
                    </li>
                  ))}
                </ul>

                {/* See all */}
                <div className="border-t border-gray-100 p-3">
                  <button
                    onClick={handleSubmit as unknown as React.MouseEventHandler}
                    className="w-full text-center text-[12px] font-semibold text-brand-orange hover:text-orange-600 transition-colors py-1"
                  >
                    Voir tous les résultats pour &ldquo;{query}&rdquo; →
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Empty state when no query */}
        {query.length < 2 && (
          <div className="px-4 py-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">
              Suggestions
            </p>
            <div className="flex flex-wrap gap-2">
              {["Ensemble", "Robe", "Bébé", "Bonnet", "Short"].map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="text-xs bg-gray-100 hover:bg-orange-50 hover:text-brand-orange transition-colors px-3 py-1.5 rounded-full font-medium"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
