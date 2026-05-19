import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { OrdersTable } from "./OrdersTable";

const STATUS_LABELS: Record<string, string> = {
  PENDING:    "En attente",
  PAID:       "Payé",
  PROCESSING: "En préparation",
  SHIPPED:    "Expédié",
  DELIVERED:  "Livré",
  CANCELLED:  "Annulé",
  REFUNDED:   "Remboursé",
};

const ALL_STATUSES = Object.keys(STATUS_LABELS);

async function getOrders(status?: string) {
  try {
    return await (prisma as any).order.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { user: { select: { fullName: true, email: true } } },
    });
  } catch {
    return [];
  }
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const orders = await getOrders(status);

  return (
    <div className="p-8 max-w-[1200px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Commandes</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">
            {orders.length} commande{orders.length !== 1 ? "s" : ""}
            {status ? ` · ${STATUS_LABELS[status] ?? status}` : ""}
          </p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/admin/orders"
          className={`px-4 py-2 rounded-xl text-[12px] font-semibold transition-colors ${
            !status ? "bg-black text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
          }`}
        >
          Toutes
        </Link>
        {ALL_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`px-4 py-2 rounded-xl text-[12px] font-semibold transition-colors ${
              status === s ? "bg-black text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            {STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      <OrdersTable orders={orders} />
    </div>
  );
}
