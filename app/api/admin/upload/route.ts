import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { prisma } from "@/lib/prisma";

const ALLOWED_BUCKETS = ["products", "brands", "categories"] as const;
type Bucket = (typeof ALLOWED_BUCKETS)[number];

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autorisé");
  const dbUser = await (prisma as any).user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });
  if (!dbUser || dbUser.role !== "ADMIN") throw new Error("Accès refusé");
}

async function ensureBucket(client: ReturnType<typeof createAdminClient>, bucket: Bucket) {
  const { data: buckets } = await client.storage.listBuckets();
  if (!buckets?.find((b) => b.name === bucket)) {
    await client.storage.createBucket(bucket, { public: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    await assertAdmin();
  } catch {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Bucket optionnel via query param (?bucket=brands), défaut : products
  const bucketParam = req.nextUrl.searchParams.get("bucket") ?? "products";
  const bucket: Bucket = (ALLOWED_BUCKETS as readonly string[]).includes(bucketParam)
    ? (bucketParam as Bucket)
    : "products";

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file || !file.size) {
    return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
  }

  const adminClient = createAdminClient();
  await ensureBucket(adminClient, bucket);

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const buffer = await file.arrayBuffer();
  const { error } = await adminClient.storage
    .from(bucket)
    .upload(path, buffer, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = adminClient.storage.from(bucket).getPublicUrl(path);

  return NextResponse.json({ url: publicUrl });
}
