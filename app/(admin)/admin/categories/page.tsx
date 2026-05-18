import Link from "next/link";
import { Plus, Pencil, FolderOpen, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getCategories() {
  try {
    return await (prisma as any).category.findMany({
      orderBy: [{ position: "asc" }, { name: "asc" }],
      include: {
        _count: { select: { products: true } },
        parent: { select: { name: true } },
        children: { select: { id: true } },
      },
    });
  } catch {
    return [];
  }
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  // Séparer catégories racine et sous-catégories pour l'affichage
  const roots = categories.filter((c: any) => !c.parentId);
  const subs = categories.filter((c: any) => c.parentId);

  return (
    <div className="p-8 max-w-[900px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Catégories</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">
            {categories.length} catégorie{categories.length !== 1 ? "s" : ""}
            {subs.length > 0 && ` dont ${subs.length} sous-catégorie${subs.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors"
        >
          <Plus size={15} /> Nouvelle catégorie
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {categories.length === 0 ? (
          <div className="py-20 text-center">
            <FolderOpen size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm mb-4">Aucune catégorie pour le moment</p>
            <Link
              href="/admin/categories/new"
              className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors"
            >
              <Plus size={15} /> Créer la première catégorie
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {["Catégorie", "Slug", "Parente", "Produits", "Pos.", ""].map((h) => (
                  <th
                    key={h}
                    className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 py-3 first:pl-6 last:pr-6 last:w-16"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((c: any) => (
                <tr key={c.id} className="hover:bg-gray-50/40 transition-colors">
                  {/* Nom */}
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      {c.parentId && (
                        <ChevronRight size={12} className="text-gray-300 shrink-0" />
                      )}
                      <div className="flex items-center gap-2">
                        {c.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={c.imageUrl}
                            alt=""
                            className="w-7 h-7 rounded-lg object-cover shrink-0"
                          />
                        )}
                        <div>
                          <p className="text-[13px] font-semibold">{c.name}</p>
                          {c.children?.length > 0 && (
                            <p className="text-[10px] text-gray-400">
                              {c.children.length} sous-catégorie{c.children.length !== 1 ? "s" : ""}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* Slug */}
                  <td className="px-4 py-3">
                    <span className="font-mono text-[11px] text-gray-400">{c.slug}</span>
                  </td>
                  {/* Parente */}
                  <td className="px-4 py-3 text-[12px] text-gray-500">
                    {c.parent?.name ?? <span className="text-gray-300">—</span>}
                  </td>
                  {/* Produits */}
                  <td className="px-4 py-3 text-[12px] text-gray-500">
                    {c._count.products}
                  </td>
                  {/* Position */}
                  <td className="px-4 py-3 text-[12px] text-gray-400 font-mono">
                    {c.position}
                  </td>
                  {/* Edit */}
                  <td className="px-6 py-3 text-right">
                    <Link
                      href={`/admin/categories/${c.id}`}
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 hover:text-black transition-colors"
                    >
                      <Pencil size={12} /> Éditer
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
