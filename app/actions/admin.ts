"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<{ error?: string }> {
  try {
    await assertAdmin();
    await (prisma as any).order.update({ where: { id: orderId }, data: { status } });
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    return {};
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Erreur" };
  }
}

export type VariantInput = {
  size: string;
  color?: string;
  sku: string;
  stock: number;
  priceOverride?: number;
};

export type ImageInput = {
  url: string;
  alt?: string;
  position: number;
};

export type ProductInput = {
  name: string;
  slug: string;
  description?: string;
  categoryId: string;
  brandId?: string;
  basePrice: number;
  comparePrice?: number;
  gender: string;
  ageRangeMin?: number;
  ageRangeMax?: number;
  isActive: boolean;
  isFeatured: boolean;
  variants: VariantInput[];
  images: ImageInput[];
};

export async function createProduct(
  data: ProductInput
): Promise<{ error?: string; id?: string }> {
  try {
    await assertAdmin();
    const product = await (prisma as any).product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        categoryId: data.categoryId,
        brandId: data.brandId || null,
        basePrice: data.basePrice,
        comparePrice: data.comparePrice || null,
        gender: data.gender,
        ageRangeMin: data.ageRangeMin || null,
        ageRangeMax: data.ageRangeMax || null,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        variants: { create: data.variants },
        images: { create: data.images },
      },
    });
    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { id: product.id };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Erreur lors de la création" };
  }
}

export async function updateProduct(
  id: string,
  data: ProductInput
): Promise<{ error?: string }> {
  try {
    await assertAdmin();
    await (prisma as any).productVariant.deleteMany({ where: { productId: id } });
    await (prisma as any).productImage.deleteMany({ where: { productId: id } });
    await (prisma as any).product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        categoryId: data.categoryId,
        brandId: data.brandId || null,
        basePrice: data.basePrice,
        comparePrice: data.comparePrice || null,
        gender: data.gender,
        ageRangeMin: data.ageRangeMin || null,
        ageRangeMax: data.ageRangeMax || null,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        variants: { create: data.variants },
        images: { create: data.images },
      },
    });
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);
    revalidatePath("/products");
    return {};
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Erreur lors de la mise à jour" };
  }
}

export async function toggleProductActive(
  id: string,
  isActive: boolean
): Promise<{ error?: string }> {
  try {
    await assertAdmin();
    await (prisma as any).product.update({ where: { id }, data: { isActive } });
    revalidatePath("/admin/products");
    return {};
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Erreur" };
  }
}

export async function toggleProductFeatured(
  id: string,
  isFeatured: boolean
): Promise<{ error?: string }> {
  try {
    await assertAdmin();
    await (prisma as any).product.update({ where: { id }, data: { isFeatured } });
    revalidatePath("/admin/products");
    revalidatePath("/");
    return {};
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Erreur" };
  }
}

export async function deleteProduct(id: string): Promise<{ error?: string }> {
  try {
    await assertAdmin();
    await (prisma as any).product.delete({ where: { id } });
    revalidatePath("/admin/products");
    revalidatePath("/products");
    return {};
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Erreur lors de la suppression" };
  }
}

// ── Categories ────────────────────────────────────────────────────────────────

export type CategoryInput = {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  position?: number;
};

export async function createCategory(
  data: CategoryInput
): Promise<{ error?: string; id?: string }> {
  try {
    await assertAdmin();
    const category = await (prisma as any).category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        parentId: data.parentId || null,
        position: data.position ?? 0,
      },
    });
    revalidatePath("/admin/categories");
    revalidatePath("/products");
    return { id: category.id };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Erreur lors de la création" };
  }
}

export async function updateCategory(
  id: string,
  data: CategoryInput
): Promise<{ error?: string }> {
  try {
    await assertAdmin();
    await (prisma as any).category.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        parentId: data.parentId || null,
        position: data.position ?? 0,
      },
    });
    revalidatePath("/admin/categories");
    revalidatePath(`/admin/categories/${id}`);
    revalidatePath("/products");
    return {};
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Erreur lors de la mise à jour" };
  }
}

export async function deleteCategory(id: string): Promise<{ error?: string }> {
  try {
    await assertAdmin();
    await (prisma as any).category.delete({ where: { id } });
    revalidatePath("/admin/categories");
    revalidatePath("/products");
    return {};
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Erreur lors de la suppression" };
  }
}

// ── Brands ────────────────────────────────────────────────────────────────────

export type BrandInput = {
  name: string;
  slug: string;
  logoUrl?: string;
};

export async function createBrand(
  data: BrandInput
): Promise<{ error?: string; id?: string }> {
  try {
    await assertAdmin();
    const brand = await (prisma as any).brand.create({
      data: {
        name: data.name,
        slug: data.slug,
        logoUrl: data.logoUrl || null,
      },
    });
    revalidatePath("/admin/brands");
    revalidatePath("/brands");
    return { id: brand.id };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Erreur lors de la création" };
  }
}

export async function updateBrand(
  id: string,
  data: BrandInput
): Promise<{ error?: string }> {
  try {
    await assertAdmin();
    await (prisma as any).brand.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        logoUrl: data.logoUrl || null,
      },
    });
    revalidatePath("/admin/brands");
    revalidatePath(`/admin/brands/${id}`);
    revalidatePath("/brands");
    return {};
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Erreur lors de la mise à jour" };
  }
}

export async function deleteBrand(id: string): Promise<{ error?: string }> {
  try {
    await assertAdmin();
    await (prisma as any).brand.delete({ where: { id } });
    revalidatePath("/admin/brands");
    revalidatePath("/brands");
    return {};
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Erreur lors de la suppression" };
  }
}
