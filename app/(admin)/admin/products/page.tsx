import Link from "next/link";
import { Plus, Pencil, Eye, EyeOff } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { ToggleActiveButton } from "./ToggleActiveButton";

async function getProducts() {
  try {
    return await (prisma as any).product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { name: true } },
        brand: { select: { name: true } },
        variants: { select: { stock: true } },
        images: {
          where: { position: 0 },
          take: 1,
          select: { url: true },
        },
      },
    });
  } catch {
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  const totalStock = (variants: { stock: number }[]) =>
    variants.reduce((s, v) => s + v.stock, 0);

  return (
    <div className="p-8 max-w-[1200px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Produits</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">
            {products.length} produit{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors"
        >
          <Plus size={15} /> Nouveau produit
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {products.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-400 text-sm mb-4">Aucun produit pour le moment</p>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors"
            >
              <Plus size={15} /> Créer le premier produit
            </Link>
          </div>
        ) : (
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
                <th className="px-6 py-3 w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product: any) => {
                const stock = totalStock(product.variants);
                const imageUrl = product.images[0]?.url;

                return (
                  <tr key={product.id} className="hover:bg-gray-50/40 transition-colors">
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
                    <td className="px-4 py-3 text-center">
                      <ToggleActiveButton
                        productId={product.id}
                        isActive={product.isActive}
                      />
                    </td>

                    {/* Edit */}
                    <td className="px-6 py-3 text-right">
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
        )}
      </div>
    </div>
  );
}
