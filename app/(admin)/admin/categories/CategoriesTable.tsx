"use client";

import Link from "next/link";
import { useState } from "react";
import { Pencil, ChevronRight, FolderOpen } from "lucide-react";
import { TablePagination } from "@/components/admin/TablePagination";

type Category = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  parentId: string | null;
  position: number;
  parent?: { name: string } | null;
  children?: { id: string }[];
  _count: { products: number };
};

const PER_PAGE = 10;

export function CategoriesTable({ categories }: { categories: Category[] }) {
  const [page, setPage] = useState(1);
  const paginated = categories.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
        <FolderOpen size={32} className="text-gray-200 mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Aucune catégorie pour le moment</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            {["Catégorie", "Slug", "Parente", "Produits", "Pos.", ""].map((h) => (
              <th key={h} className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 py-3 first:pl-6 last:pr-6 last:w-16">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {paginated.map((c) => (
            <tr key={c.id} className="relative hover:bg-gray-50/40 cursor-pointer transition-colors">
              <td className="px-6 py-3">
                <Link href={`/admin/categories/${c.id}`} className="absolute inset-0" aria-label={`Éditer ${c.name}`} />
                <div className="flex items-center gap-2">
                  {c.parentId && <ChevronRight size={12} className="text-gray-300 shrink-0" />}
                  {c.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.imageUrl} alt="" className="w-7 h-7 rounded-lg object-cover shrink-0" />
                  )}
                  <div>
                    <p className="text-[13px] font-semibold">{c.name}</p>
                    {c.children && c.children.length > 0 && (
                      <p className="text-[10px] text-gray-400">
                        {c.children.length} sous-catégorie{c.children.length !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="font-mono text-[11px] text-gray-400">{c.slug}</span>
              </td>
              <td className="px-4 py-3 text-[12px] text-gray-500">
                {c.parent?.name ?? <span className="text-gray-300">—</span>}
              </td>
              <td className="px-4 py-3 text-[12px] text-gray-500">{c._count.products}</td>
              <td className="px-4 py-3 text-[12px] text-gray-400 font-mono">{c.position}</td>
              <td className="relative z-10 px-6 py-3 text-right">
                <Link href={`/admin/categories/${c.id}`} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 hover:text-black transition-colors">
                  <Pencil size={12} /> Éditer
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <TablePagination total={categories.length} page={page} perPage={PER_PAGE} onPageChange={setPage} />
    </div>
  );
}
