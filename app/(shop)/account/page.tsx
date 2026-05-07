import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";
import Link from "next/link";
import {
  User, Package, LogOut, ChevronRight, ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon compte",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/account");

  const displayName = (user.user_metadata?.full_name as string | undefined)
    ?? user.email?.split("@")[0]
    ?? "Votre compte";

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      {/* BANNER */}
      <section className="pt-16 pb-12 px-6 bg-[#99C5FF]">
        <div className="container-shop">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-brand-blue-dark flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {initial}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{displayName}</h1>
              <p className="text-sm text-gray-600 mt-0.5">{user.email}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shop py-12 max-w-2xl">
        <div className="space-y-3">
          {/* My orders */}
          <Link
            href="/orders/track"
            className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 px-6 py-5 hover:border-gray-200 hover:shadow-sm transition-all"
          >
            <div className="w-11 h-11 rounded-xl bg-[#fff3bb] flex items-center justify-center shrink-0">
              <Package size={20} className="text-gray-700" />
            </div>
            <div className="flex-1">
              <div className="text-[15px] font-bold">Mes commandes</div>
              <div className="text-[12px] text-gray-500">Suivre et consulter l&apos;historique de vos commandes</div>
            </div>
            <ChevronRight size={16} className="text-gray-400 shrink-0" />
          </Link>

          {/* Security */}
          <div className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 px-6 py-5">
            <div className="w-11 h-11 rounded-xl bg-[#d8f5c0] flex items-center justify-center shrink-0">
              <ShieldCheck size={20} className="text-gray-700" />
            </div>
            <div className="flex-1">
              <div className="text-[15px] font-bold">Sécurité</div>
              <div className="text-[12px] text-gray-500">{user.email}</div>
            </div>
          </div>

          {/* Logout */}
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center gap-4 bg-white rounded-2xl border border-gray-100 px-6 py-5 hover:border-red-100 hover:bg-red-50 transition-all text-left group"
            >
              <div className="w-11 h-11 rounded-xl bg-[#F6E5E5] flex items-center justify-center shrink-0">
                <LogOut size={20} className="text-gray-700 group-hover:text-red-500 transition-colors" />
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-bold group-hover:text-red-500 transition-colors">
                  Se déconnecter
                </div>
                <div className="text-[12px] text-gray-500">Fermer la session sur cet appareil</div>
              </div>
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
