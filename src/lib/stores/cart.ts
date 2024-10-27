// src/lib/stores/cart.ts
import { writable } from 'svelte/store';
import type { Product } from '$lib/types/Product';

interface CartItem {
  product: Product;
  quantity: number;
}

// Store para controlar se o carrinho está aberto
export const isCartOpen = writable(false);

export const cart = writable<CartItem[]>([]);

export const addToCart = (product: Product, quantity: number = 1) => {
  cart.update(items => {
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

export const removeFromCart = (productId: string) => {
  cart.update(items => items.filter(item => item.product.id !== productId));
};

export const increaseQuantity = (productId: string) => {
  cart.update(items => 
    items.map(item =>
      item.product.id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )
  );
};

export const decreaseQuantity = (productId: string) => {
  cart.update(items => {
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

export const clearCart = () => {
  cart.set([]);
};
