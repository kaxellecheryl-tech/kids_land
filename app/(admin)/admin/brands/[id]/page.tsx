import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BrandForm } from "@/components/admin/BrandForm";

async function getBrand(id: string) {
  try {
    return await (prisma as any).brand.findUnique({ where: { id } });
  } catch {
    return null;
  }
}

export default async function EditBrandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const brand = await getBrand(id);

  if (!brand) notFound();

  return (
    <div className="p-8 max-w-[600px]">
      <div className="mb-6">
        <Link
          href="/admin/brands"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-4"
        >
          <ArrowLeft size={12} /> Marques
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{brand.name}</h1>
            <p className="text-[12px] text-gray-400 font-mono mt-0.5">/brands/{brand.slug}</p>
          </div>
          <Link
            href={`/brands/${brand.slug}`}
            target="_blank"
            className="text-[11px] font-semibold text-gray-500 hover:text-black transition-colors border border-gray-200 rounded-lg px-3 py-1.5"
          >
            Voir sur la boutique ↗
          </Link>
        </div>
      </div>

      <BrandForm
        initial={{
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
          description: brand.description,
          logoUrl: brand.logoUrl,
        }}
      />
    </div>
  );
}
