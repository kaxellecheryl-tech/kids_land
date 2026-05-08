import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

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

  const dbUser = await (prisma as any).user.findUnique({
    where: { id: user.id },
    select: { role: true, fullName: true },
  });

  if (!dbUser || dbUser.role !== "ADMIN") redirect("/");

  return (
    <div className="flex min-h-screen bg-[#F4F5F7]">
      <AdminSidebar user={{ fullName: dbUser.fullName, email: user.email }} />
      <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
    </div>
  );
}
