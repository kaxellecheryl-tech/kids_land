"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useWishlist } from "@/lib/wishlist-store";
import { syncWishlist } from "@/app/actions/wishlist-sync";

export function WishlistSyncProvider() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      userIdRef.current = data.user?.id ?? null;
      if (data.user) {
        syncWishlist(useWishlist.getState().items).catch(console.error);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      userIdRef.current = session?.user?.id ?? null;
      if (session?.user) {
        syncWishlist(useWishlist.getState().items).catch(console.error);
      }
    });

    const unsubWishlist = useWishlist.subscribe((state) => {
      if (!userIdRef.current) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        syncWishlist(state.items).catch(console.error);
      }, 1500);
    });

    return () => {
      subscription.unsubscribe();
      unsubWishlist();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return null;
}
