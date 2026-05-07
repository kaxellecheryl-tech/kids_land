import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type WishlistItem = {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  basePrice: number;
  comparePrice?: number | null;
};

type WishlistState = {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
  count: () => number;
};

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggle: (item) =>
        set((state) => {
          const exists = state.items.some((i) => i.productId === item.productId);
          return {
            items: exists
              ? state.items.filter((i) => i.productId !== item.productId)
              : [...state.items, item],
          };
        }),

      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      has: (productId) => get().items.some((i) => i.productId === productId),

      count: () => get().items.length,
    }),
    {
      name: "kidsland-wishlist",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
