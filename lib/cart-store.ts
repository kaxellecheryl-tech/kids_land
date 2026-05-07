import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  productId: string;
  variantId?: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  size?: string;
  color?: string;
  unitPrice: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clear: () => void;
  toggle: () => void;
  open: () => void;
  close: () => void;
  // Selectors (computed)
  getTotalItems: () => number;
  getSubtotal: () => number;
};

const itemKey = (i: { productId: string; variantId?: string }) =>
  `${i.productId}-${i.variantId ?? ""}`;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item, quantity = 1) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => itemKey(i) === itemKey(item)
          );
          if (existingIndex >= 0) {
            const newItems = [...state.items];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newItems[existingIndex].quantity + quantity,
            };
            return { items: newItems };
          }
          return { items: [...state.items, { ...item, quantity }] };
        }),

      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => itemKey(i) !== itemKey({ productId, variantId })
          ),
        })),

      updateQuantity: (productId, variantId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (i) => itemKey(i) !== itemKey({ productId, variantId })
              ),
            };
          }
          return {
            items: state.items.map((i) =>
              itemKey(i) === itemKey({ productId, variantId })
                ? { ...i, quantity }
                : i
            ),
          };
        }),

      clear: () => set({ items: [] }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),

      getTotalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    }),
    {
      name: "kidsland-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }), // ne pas persister isOpen
    }
  )
);
