"use client";

import Link from "next/link";
import { useState } from "react";
import { Pencil, Tag } from "lucide-react";
import { TablePagination } from "@/components/admin/TablePagination";

type Brand = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  _count: { products: number };
};

const PER_PAGE = 10;

export function BrandsTable({ brands }: { brands: Brand[] }) {
  const [page, setPage] = useState(1);
  const paginated = brands.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (brands.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
        <Tag size={40} className="text-gray-200 mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Aucune marque pour le moment</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 px-6 py-3 w-20">Logo</th>
            <th className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 py-3">Nom</th>
            <th className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 py-3">Slug</th>
            <th className="text-right text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 py-3">Produits actifs</th>
            <th className="px-6 py-3 w-20" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {paginated.map((brand) => (
            <tr key={brand.id} className="relative hover:bg-gray-50/40 cursor-pointer transition-colors">
              <td className="px-6 py-3">
                <Link href={`/admin/brands/${brand.id}`} className="absolute inset-0" aria-label={`Éditer ${brand.name}`} />
                <div className="w-16 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                  {brand.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <Tag size={16} className="text-gray-300" />
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <p className="text-[13px] font-semibold">{brand.name}</p>
              </td>
              <td className="px-4 py-3">
                <span className="font-mono text-[11px] text-gray-400">{brand.slug}</span>
              </td>
              <td className="px-4 py-3 text-right">
                <span className="text-[13px] font-semibold text-gray-700">{brand._count.products}</span>
              </td>
              <td className="relative z-10 px-6 py-3 text-right">
                <Link href={`/admin/brands/${brand.id}`} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 hover:text-black transition-colors">
                  <Pencil size={12} /> Éditer
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <TablePagination total={brands.length} page={page} perPage={PER_PAGE} onPageChange={setPage} />
    </div>
  );
}
