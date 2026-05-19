"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Pencil } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { ToggleActiveButton } from "./ToggleActiveButton";
import { ToggleFeaturedButton } from "./ToggleFeaturedButton";
import { TablePagination } from "@/components/admin/TablePagination";

type Product = {
  id: string;
  name: string;
  basePrice: number;
  comparePrice: number | null;
  isActive: boolean;
  isFeatured: boolean;
  category: { name: string };
  brand: { name: string } | null;
  variants: { stock: number }[];
  images: { url: string }[];
};

const PER_PAGE = 10;

export function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand?.name.toLowerCase().includes(q) ||
          p.category.name.toLowerCase().includes(q)
        );
      })
    : products;

  const featuredCount = products.filter((p) => p.isFeatured).length;

  // Reset to page 1 when search changes
  const handleQuery = (q: string) => { setQuery(q); setPage(1); };

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalStock = (variants: { stock: number }[]) =>
    variants.reduce((s, v) => s + v.stock, 0);

  return (
    <>
      {/* Search bar */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Rechercher par nom, marque ou catégorie…"
            value={query}
            onChange={(e) => handleQuery(e.target.value)}
            className="w-full max-w-sm pl-9 pr-4 py-2.5 text-[13px] rounded-xl border border-gray-200 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition"
          />
          {query && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] text-gray-400">
              {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Vitrine indicator */}
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 bg-brand-yellow/40 px-3 py-1.5 rounded-full shrink-0">
          <span>★</span>
          <span>Vitrine : {featuredCount} / 2</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            Aucun produit pour « {query} »
          </div>
        ) : (
          <>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 px-6 py-3 w-16">
                  Image
                </th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 py-3">
                  Produit
                </th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 py-3">
                  Catégorie
                </th>
                <th className="text-right text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 py-3">
                  Prix
                </th>
                <th className="text-right text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 py-3">
                  Stock
                </th>
                <th className="text-center text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 py-3">
                  Statut
                </th>
                <th className="text-center text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 py-3 w-20">
                  Vitrine
                </th>
                <th className="px-6 py-3 w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map((product) => {
                const stock = totalStock(product.variants);
                const imageUrl = product.images[0]?.url;

                return (
                  <tr key={product.id} onClick={() => router.push(`/admin/products/${product.id}`)} className="hover:bg-gray-50/40 cursor-pointer transition-colors">
                    {/* Image */}
                    <td className="px-6 py-3">
                      <div className="w-10 h-12 rounded-lg bg-brand-pink overflow-hidden">
                        {imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </td>

                    {/* Name + brand */}
                    <td className="px-4 py-3">
                      <p className="text-[13px] font-semibold leading-tight">{product.name}</p>
                      {product.brand && (
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
                          {product.brand.name}
                        </p>
                      )}
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 text-[12px] text-gray-500">
                      {product.category.name}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 text-right">
                      <span className="text-[13px] font-bold">
                        {formatPrice(product.basePrice)}
                      </span>
                      {product.comparePrice && (
                        <span className="text-[11px] text-gray-400 line-through ml-1">
                          {formatPrice(product.comparePrice)}
                        </span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`text-[12px] font-semibold ${
                          stock === 0
                            ? "text-red-500"
                            : stock <= 5
                            ? "text-amber-500"
                            : "text-gray-700"
                        }`}
                      >
                        {stock}
                      </span>
                    </td>

                    {/* Active toggle */}
                    <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <ToggleActiveButton
                        productId={product.id}
                        isActive={product.isActive}
                      />
                    </td>

                    {/* Featured / Vitrine toggle */}
                    <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <ToggleFeaturedButton
                        productId={product.id}
                        isFeatured={product.isFeatured}
                        featuredCount={featuredCount}
                      />
                    </td>

                    {/* Edit */}
                    <td className="px-6 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 hover:text-black transition-colors"
                      >
                        <Pencil size={12} /> Éditer
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <TablePagination
            total={filtered.length}
            page={page}
            perPage={PER_PAGE}
            onPageChange={setPage}
          />
          </>
        )}
      </div>
    </>
  );
}
