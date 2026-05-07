import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { OrdersList, type OrderRow } from "./OrdersList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mes commandes",
};

export default async function TrackOrderPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/orders/track");

  const raw = await (prisma as any).order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        select: {
          id: true,
          productName: true,
          productImage: true,
          variantLabel: true,
          quantity: true,
          unitPrice: true,
          subtotal: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const orders: OrderRow[] = raw.map((o: any) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
    total: o.total,
    subtotal: o.subtotal,
    discount: o.discount,
    shippingFee: o.shippingFee,
    shippingFullName: o.shippingFullName,
    shippingPhone: o.shippingPhone,
    shippingCity: o.shippingCity,
    shippingDistrict: o.shippingDistrict,
    shippingStreet: o.shippingStreet,
    items: o.items,
  }));

  return (
    <>
      {/* BANNER */}
      <section className="pt-16 pb-12 px-6 bg-[#fff3bb]">
        <div className="container-shop">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-600 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft size={12} /> Accueil
          </Link>
          <div>
            <div className="mb-3"><Package size={48} className="text-gray-700" /></div>
            <h1 className="text-5xl font-bold tracking-tight mb-2">Mes commandes</h1>
            <p className="text-sm text-gray-700">
              {orders.length > 0
                ? `${orders.length} commande${orders.length > 1 ? "s" : ""} — cliquez pour voir le détail`
                : "Aucune commande pour le moment"}
            </p>
          </div>
        </div>
      </section>

      <section className="container-shop py-12 max-w-3xl">
        <OrdersList orders={orders} />
      </section>
    </>
  );
}
