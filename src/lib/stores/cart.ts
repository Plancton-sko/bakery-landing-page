// src/lib/stores/cart.ts
import { writable } from 'svelte/store';
import type { Product } from '$lib/types/Product';

export const cart = writable<Product[]>([]);

export const addToCart = (product: Product) => {
  cart.update(items => [...items, product]);
};

export const clearCart = () => {
  cart.set([]);
};
