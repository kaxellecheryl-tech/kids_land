"use client";

import { useTransition } from "react";
import { Star } from "lucide-react";
import { toggleProductFeatured } from "@/app/actions/admin";
import { useRouter } from "next/navigation";

export function ToggleFeaturedButton({
  productId,
  isFeatured,
  featuredCount,
}: {
  productId: string;
  isFeatured: boolean;
  featuredCount: number;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const maxReached = !isFeatured && featuredCount >= 2;

  function handleToggle() {
    if (maxReached) return;
    startTransition(async () => {
      await toggleProductFeatured(productId, !isFeatured);
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending || maxReached}
      title={
        maxReached
          ? "2 articles déjà en vitrine (max)"
          : isFeatured
          ? "Retirer de la vitrine"
          : "Mettre en vitrine"
      }
      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
        isFeatured
          ? "bg-brand-yellow text-amber-700 hover:bg-red-100 hover:text-red-500"
          : maxReached
          ? "bg-gray-50 text-gray-200 cursor-not-allowed"
          : "bg-gray-100 text-gray-300 hover:bg-brand-yellow hover:text-amber-700"
      } disabled:opacity-60`}
    >
      <Star size={13} className={isFeatured ? "fill-current" : ""} />
    </button>
  );
}
