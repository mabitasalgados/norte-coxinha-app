import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  categoria: string;
  ativo: boolean;
}

export interface CartItem extends Product {
  quantidade: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Product, quantidade?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantidade: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantidade = 1) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id
                ? { ...item, quantidade: item.quantidade + quantidade }
                : item
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantidade }] });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },
      updateQuantity: (id, quantidade) => {
        if (quantidade <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantidade } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.preco * item.quantidade,
          0
        );
      },
    }),
    {
      name: 'norte-coxinha-cart',
    }
  )
);
