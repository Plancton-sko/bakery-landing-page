// src/lib/stores/cart.ts
import { writable, derived } from 'svelte/store';
import { get as getFromDB, set as setInDB, del as deleteFromDB } from 'idb-keyval';
import type { Product } from '$lib/types/Product';
import { activeDiscounts } from '$lib/consts/Discounts';
import { calculateDiscounts } from '$lib/utils/discounts';
import type { AppliedDiscount } from '$lib/types/Discount';
import { browser } from '$app/environment';

export interface CartItem {
  product: Product;
  quantity: number;
  appliedDiscount?: AppliedDiscount;
}

const CART_DB_KEY = 'cart';
export const isCartOpen = writable(false);

// Store principal do carrinho
const initialCart: CartItem[] = [];
export const cart = writable<CartItem[]>(initialCart);

// Store derivada para preço total considerando descontos
export const totalPrice = derived(
  cart,
  ($cart) => $cart.reduce(
    (total, item) => {
      const price = item.appliedDiscount?.finalPrice || item.product.price;
      return total + (price * item.quantity);
    },
    0
  )
);

// Funções de persistência
const saveCartToDB = async (cartItems: CartItem[]): Promise<void> => {
  if (!browser) return;
  try {
    await setInDB(CART_DB_KEY, cartItems);
  } catch (error) {
    console.error('Erro ao salvar carrinho:', error);
  }
};

export const loadCartFromDB = async (): Promise<void> => {
  if (!browser) return;
  try {
    const savedCart = await getFromDB<CartItem[]>(CART_DB_KEY);
    if (savedCart) cart.set(savedCart);
  } catch (error) {
    console.error('Erro ao carregar carrinho:', error);
  }
};

const clearCartFromDB = async (): Promise<void> => {
  if (!browser) return;
  try {
    await deleteFromDB(CART_DB_KEY);
  } catch (error) {
    console.error('Erro ao limpar carrinho:', error);
  }
};

// Ações do carrinho
export const addToCart = (product: Product, quantity: number = 1): void => {
  cart.update((items) => {
    const discount = calculateDiscounts(product, activeDiscounts);
    const existingIndex = items.findIndex((item) => item.product.id === product.id);
    
    if (existingIndex > -1) {
      const updatedItems = [...items];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: updatedItems[existingIndex].quantity + quantity,
        // Mantém o desconto original se já existir
        appliedDiscount: updatedItems[existingIndex].appliedDiscount || discount
      };
      saveCartToDB(updatedItems);
      return updatedItems;
    }

    const newCart = [...items, { 
      product, 
      quantity,
      appliedDiscount: discount 
    }];
    
    saveCartToDB(newCart);
    return newCart;
  });
};

export const removeFromCart = (productId: string): void => {
  cart.update((items) => {
    const newCart = items.filter((item) => item.product.id !== productId);
    saveCartToDB(newCart);
    return newCart;
  });
};

export const increaseQuantity = (productId: string): void => {
  cart.update((items) => {
    const newCart = items.map((item) => 
      item.product.id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    saveCartToDB(newCart);
    return newCart;
  });
};

export const decreaseQuantity = (productId: string): void => {
  cart.update((items) => {
    const newCart = items
      .map((item) => 
        item.product.id === productId
          ? { ...item, quantity: Math.max(item.quantity - 1, 0) }
          : item
      )
      .filter((item) => item.quantity > 0);
      
    saveCartToDB(newCart);
    return newCart;
  });
};

export const clearCart = (): void => {
  cart.set([]);
  clearCartFromDB();
};

// Inicialização
if (browser) {
  loadCartFromDB();
}