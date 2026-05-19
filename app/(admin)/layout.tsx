import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/admin");

  const [dbUser, pendingCount] = await Promise.all([
    (prisma as any).user.findUnique({
      where: { id: user.id },
      select: { role: true, fullName: true },
    }),
    (prisma as any).order.count({ where: { status: "PENDING" } }).catch(() => 0),
  ]);

  if (!dbUser || dbUser.role !== "ADMIN") redirect("/");

  return (
    <div className="flex min-h-screen bg-[#F4F5F7]">
      <AdminSidebar
        user={{ fullName: dbUser.fullName, email: user.email }}
        pendingOrdersCount={pendingCount}
      />
      <div className="flex-1 min-w-0 flex flex-col">
        <AdminTopBar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
