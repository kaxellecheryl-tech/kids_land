import Link from "next/link";
import { Plus, Pencil, Tag } from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getBrands() {
  try {
    return await (prisma as any).brand.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { products: { where: { isActive: true } } } },
      },
    });
  } catch {
    return [];
  }
}

export default async function AdminBrandsPage() {
  const brands = await getBrands();

  return (
    <div className="p-8 max-w-[900px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Marques</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">
            {brands.length} marque{brands.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/brands/new"
          className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors"
        >
          <Plus size={15} /> Nouvelle marque
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {brands.length === 0 ? (
          <div className="py-20 text-center">
            <Tag size={40} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-sm mb-4">Aucune marque pour le moment</p>
            <Link
              href="/admin/brands/new"
              className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors"
            >
              <Plus size={15} /> Créer la première marque
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 px-6 py-3 w-20">
                  Logo
                </th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 py-3">
                  Nom
                </th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 py-3">
                  Slug
                </th>
                <th className="text-right text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 py-3">
                  Produits actifs
                </th>
                <th className="px-6 py-3 w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {brands.map((brand: any) => (
                <tr key={brand.id} className="hover:bg-gray-50/40 transition-colors">
                  {/* Logo */}
                  <td className="px-6 py-3">
                    <div className="w-16 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                      {brand.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={brand.logoUrl}
                          alt={brand.name}
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <Tag size={16} className="text-gray-300" />
                      )}
                    </div>
                  </td>

                  {/* Name */}
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-semibold">{brand.name}</p>
                  </td>

                  {/* Slug */}
                  <td className="px-4 py-3">
                    <span className="font-mono text-[11px] text-gray-400">{brand.slug}</span>
                  </td>

                  {/* Product count */}
                  <td className="px-4 py-3 text-right">
                    <span className="text-[13px] font-semibold text-gray-700">
                      {brand._count.products}
                    </span>
                  </td>

                  {/* Edit */}
                  <td className="px-6 py-3 text-right">
                    <Link
                      href={`/admin/brands/${brand.id}`}
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
