"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/lib/cart-store";
import { syncCart } from "@/app/actions/cart-sync";

export function CartSyncProvider() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      userIdRef.current = data.user?.id ?? null;
      if (data.user) {
        // Sync immédiat au chargement si connecté
        syncCart(useCart.getState().items).catch(console.error);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      userIdRef.current = session?.user?.id ?? null;
      if (session?.user) {
        syncCart(useCart.getState().items).catch(console.error);
      }
    });

    // Écoute les changements du store Zustand
    const unsubCart = useCart.subscribe((state) => {
      if (!userIdRef.current) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        syncCart(state.items).catch(console.error);
      }, 1500);
    });

    return () => {
      subscription.unsubscribe();
      unsubCart();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return null;
}
