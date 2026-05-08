import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  PAID: "Payé",
  PROCESSING: "En préparation",
  SHIPPED: "Expédié",
  DELIVERED: "Livré",
  CANCELLED: "Annulé",
  REFUNDED: "Remboursé",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-600",
};

const ALL_STATUSES = Object.keys(STATUS_LABELS);

async function getOrders(status?: string) {
  try {
    return await (prisma as any).order.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        user: { select: { fullName: true, email: true } },
      },
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
      {/* Header */}
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
            !status
              ? "bg-black text-white"
              : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
          }`}
        >
          Toutes
        </Link>
        {ALL_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`px-4 py-2 rounded-xl text-[12px] font-semibold transition-colors ${
              status === s
                ? "bg-black text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            {STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {orders.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm">
            Aucune commande
            {status ? ` avec le statut "${STATUS_LABELS[status] ?? status}"` : ""}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 px-6 py-3">
                  N° commande
                </th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 py-3">
                  Client
                </th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 py-3">
                  Date
                </th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 py-3">
                  Statut
                </th>
                <th className="text-right text-[10px] font-black uppercase tracking-widest text-gray-400 px-6 py-3">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-[13px] font-bold text-black hover:text-brand-orange transition-colors"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-[13px] font-medium">
                      {order.user?.fullName ?? order.shippingFullName}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {order.shippingPhone}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-[12px] text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                        STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-[13px] font-bold">
                    {formatPrice(order.total)}
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
