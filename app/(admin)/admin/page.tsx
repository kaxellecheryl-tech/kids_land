import Link from "next/link";
import {
  ShoppingBag,
  Package,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
  Truck,
  XCircle,
} from "lucide-react";
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

async function getDashboardData() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  try {
    const [
      ordersToday,
      revenueTodayAgg,
      revenueMonthAgg,
      pendingCount,
      activeProducts,
      recentOrders,
    ] = await Promise.all([
      (prisma as any).order.count({ where: { createdAt: { gte: today } } }),
      (prisma as any).order.aggregate({
        where: { paymentStatus: "PAID", createdAt: { gte: today } },
        _sum: { total: true },
      }),
      (prisma as any).order.aggregate({
        where: { paymentStatus: "PAID", createdAt: { gte: startOfMonth } },
        _sum: { total: true },
      }),
      (prisma as any).order.count({ where: { status: "PENDING" } }),
      (prisma as any).product.count({ where: { isActive: true } }),
      (prisma as any).order.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { fullName: true, email: true } },
        },
      }),
    ]);

    return {
      ordersToday: ordersToday as number,
      revenueToday: (revenueTodayAgg._sum?.total ?? 0) as number,
      revenueMonth: (revenueMonthAgg._sum?.total ?? 0) as number,
      pendingCount: pendingCount as number,
      activeProducts: activeProducts as number,
      recentOrders: recentOrders as any[],
    };
  } catch {
    return {
      ordersToday: 0,
      revenueToday: 0,
      revenueMonth: 0,
      pendingCount: 0,
      activeProducts: 0,
      recentOrders: [],
    };
  }
}

export default async function AdminDashboard() {
  const data = await getDashboardData();

  const stats = [
    {
      label: "Commandes aujourd'hui",
      value: data.ordersToday,
      icon: ShoppingBag,
      color: "bg-brand-orange/10 text-brand-orange",
      href: "/admin/orders",
    },
    {
      label: "Revenus du jour",
      value: formatPrice(data.revenueToday),
      icon: TrendingUp,
      color: "bg-green-100 text-green-600",
      href: "/admin/orders",
    },
    {
      label: "Revenus ce mois",
      value: formatPrice(data.revenueMonth),
      icon: TrendingUp,
      color: "bg-blue-100 text-blue-600",
      href: "/admin/orders",
    },
    {
      label: "En attente de traitement",
      value: data.pendingCount,
      icon: Clock,
      color: "bg-amber-100 text-amber-600",
      href: "/admin/orders?status=PENDING",
    },
    {
      label: "Produits actifs",
      value: data.activeProducts,
      icon: Package,
      color: "bg-purple-100 text-purple-600",
      href: "/admin/products",
    },
  ];

  return (
    <div className="p-8 max-w-[1200px]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">
          {new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow group"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}
              >
                <Icon size={18} />
              </div>
              <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
              <div className="text-[11px] text-gray-500 mt-0.5 leading-tight">{stat.label}</div>
            </Link>
          );
        })}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-[15px] font-bold">Dernières commandes</h2>
          <Link
            href="/admin/orders"
            className="text-[12px] text-brand-orange font-semibold flex items-center gap-1 hover:gap-2 transition-all"
          >
            Tout voir <ArrowRight size={12} />
          </Link>
        </div>

        {data.recentOrders.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            Aucune commande pour le moment
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {data.recentOrders.map((order: any) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/60 transition-colors group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      order.status === "DELIVERED"
                        ? "bg-green-100"
                        : order.status === "CANCELLED"
                        ? "bg-red-100"
                        : order.status === "SHIPPED"
                        ? "bg-indigo-100"
                        : "bg-gray-100"
                    }`}
                  >
                    {order.status === "DELIVERED" ? (
                      <CheckCircle2 size={14} className="text-green-600" />
                    ) : order.status === "CANCELLED" ? (
                      <XCircle size={14} className="text-red-500" />
                    ) : order.status === "SHIPPED" ? (
                      <Truck size={14} className="text-indigo-600" />
                    ) : (
                      <ShoppingBag size={14} className="text-gray-500" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold">{order.orderNumber}</p>
                    <p className="text-[11px] text-gray-400 truncate">
                      {order.user?.fullName ?? order.shippingFullName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                      STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                  <span className="text-[13px] font-bold">{formatPrice(order.total)}</span>
                  <span className="text-[11px] text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Link
          href="/admin/products/new"
          className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow flex items-center gap-4 group"
        >
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center shrink-0 group-hover:bg-brand-orange transition-colors">
            <Package size={18} className="text-white" />
          </div>
          <div>
            <p className="text-[14px] font-bold">Ajouter un produit</p>
            <p className="text-[11px] text-gray-400">Créer une nouvelle fiche produit</p>
          </div>
        </Link>

        <Link
          href="/admin/orders?status=PENDING"
          className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow flex items-center gap-4 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <Clock size={18} className="text-amber-600" />
          </div>
          <div>
            <p className="text-[14px] font-bold">Commandes en attente</p>
            <p className="text-[11px] text-gray-400">
              {data.pendingCount} commande{data.pendingCount !== 1 ? "s" : ""} à traiter
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
