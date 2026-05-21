"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createUserRecord(data: {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  marketingConsent: boolean;
}) {
  await (prisma as any).user.upsert({
    where: { id: data.id },
    update: {},
    create: {
      id: data.id,
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      marketingConsent: data.marketingConsent,
    },
  });
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
