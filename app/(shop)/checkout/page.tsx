import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CheckoutForm } from "./CheckoutForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Valider ma commande" };

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/checkout");

  const profile = await (prisma as any).user.findUnique({
    where: { id: user.id },
    select: { fullName: true, phone: true },
  });

  return (
    <>
      <section className="pt-14 pb-8 px-6 bg-[#FDF8F8] border-b border-gray-100">
        <div className="container-shop">
          <h1 className="text-3xl font-bold tracking-tight">Valider ma commande</h1>
          <p className="text-sm text-gray-500 mt-1">
            Vérifiez votre panier, renseignez votre adresse et choisissez votre paiement.
          </p>
        </div>
      </section>

      <section className="container-shop py-10">
        <CheckoutForm
          userProfile={{
            fullName: profile?.fullName ?? null,
            phone: profile?.phone ?? null,
          }}
        />
      </section>
    </>
  );
}
