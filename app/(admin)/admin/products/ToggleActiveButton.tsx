"use client";

import { useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toggleProductActive } from "@/app/actions/admin";
import { useRouter } from "next/navigation";

export function ToggleActiveButton({
  productId,
  isActive,
}: {
  productId: string;
  isActive: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleToggle() {
    startTransition(async () => {
      await toggleProductActive(productId, !isActive);
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      title={isActive ? "Désactiver" : "Activer"}
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors ${
        isActive
          ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600"
          : "bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-700"
      } disabled:opacity-50`}
    >
      {isActive ? <Eye size={11} /> : <EyeOff size={11} />}
      {isActive ? "Actif" : "Inactif"}
    </button>
  );
}
