import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/CategoryForm";

export const metadata = { title: "Nouvelle catégorie" };

async function getCategories() {
  try {
    return await (prisma as any).category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, parentId: true },
    });
  } catch {
    return [];
  }
}

export default async function NewCategoryPage() {
  const categories = await getCategories();

  return (
    <div className="p-8 max-w-[680px]">
      <div className="mb-6">
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-4"
        >
          <ArrowLeft size={12} /> Catégories
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Nouvelle catégorie</h1>
      </div>
      <CategoryForm categories={categories} />
    </div>
  );
}
