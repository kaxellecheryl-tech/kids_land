import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CategoriesTable } from "./CategoriesTable";

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

      <CategoriesTable categories={categories} />
    </div>
  );
}
