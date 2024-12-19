// src/lib/stores/cart.ts
import { derived, writable } from 'svelte/store';
import type { Product } from '$lib/types/Product';

interface CartItem {
  product: Product;
  quantity: number;
}

// Store para controlar se o carrinho está aberto
export const isCartOpen = writable(false);

export const cart = writable<CartItem[]>([]);

export const totalPrice = derived(
  cart, 
  ($cart: CartItem[]) => $cart.reduce((total: number, item: CartItem) => total + item.product.price * item.quantity, 0)
);

export const addToCart = (product: Product, quantity: number = 1): void => {
  cart.update((items: CartItem[]): CartItem[] => {
    const existingItem = items.find(item => item.product.id === product.id);
    if (existingItem) {
      // Aumentar a quantidade com a quantidade especificada se o produto já estiver no carrinho
      return items.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      // Caso contrário, adicionar novo item com a quantidade especificada
      return [...items, { product, quantity }];
    }
  });
};

export const removeFromCart = (productId: string): void => {
  cart.update((items: CartItem[]): CartItem[] => 
    items.filter(item => item.product.id !== productId)
  );
};

export const increaseQuantity = (productId: string): void => {
  cart.update((items: CartItem[]): CartItem[] => {
    return items.map(item =>
      item.product.id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  });
};

export const decreaseQuantity = (productId: string): void => {
  cart.update((items: CartItem[]): CartItem[] => {
    const existingItem = items.find(item => item.product.id === productId);
    if (existingItem && existingItem.quantity > 1) {
      // Reduzir quantidade se maior que 1
      return items.map(item =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    }
    // Remover item se a quantidade for 1
    return items.filter(item => item.product.id !== productId);
  });
};

export const clearCart = (): void => {
  cart.set([]);
};