// src/lib/stores/cart.ts
import { writable, derived } from 'svelte/store';
import { get as getFromDB, set as setInDB, del as deleteFromDB } from 'idb-keyval';
import type { Product } from '$lib/types/Product';

interface CartItem {
  product: Product;
  quantity: number;
}

// Chave usada no IndexedDB
const CART_DB_KEY = 'cart';

// Store para controlar se o carrinho está aberto
export const isCartOpen = writable(false);

// Store para o carrinho
const initialCart: CartItem[] = [];
export const cart = writable<CartItem[]>(initialCart);

// Store derivada para o preço total
export const totalPrice = derived(
  cart,
  ($cart) =>
    $cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    )
);

/**
 * Função para salvar o estado do carrinho no IndexedDB
 */
const saveCartToDB = async (cartItems: CartItem[]): Promise<void> => {
  try {
    await setInDB(CART_DB_KEY, cartItems);
  } catch (error) {
    console.error('Erro ao salvar carrinho no IndexedDB:', error);
  }
};

/**
 * Função para carregar o carrinho do IndexedDB
 */
export const loadCartFromDB = async (): Promise<void> => {
  try {
    const savedCart = await getFromDB<CartItem[]>(CART_DB_KEY);
    if (savedCart) {
      cart.set(savedCart);
    }
  } catch (error) {
    console.error('Erro ao carregar carrinho do IndexedDB:', error);
  }
};

/**
 * Função para limpar o carrinho no IndexedDB
 */
const clearCartFromDB = async (): Promise<void> => {
  try {
    await deleteFromDB(CART_DB_KEY);
  } catch (error) {
    console.error('Erro ao limpar carrinho no IndexedDB:', error);
  }
};

// Ações para modificar o estado do carrinho
export const addToCart = (product: Product, quantity: number = 1): void => {
  cart.update((items) => {
    const existingItem = items.find((item) => item.product.id === product.id);
    let updatedCart;

    if (existingItem) {
      updatedCart = items.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedCart = [...items, { product, quantity }];
    }

    // Persistir no IndexedDB
    saveCartToDB(updatedCart);
    return updatedCart;
  });
};

export const removeFromCart = (productId: string): void => {
  cart.update((items) => {
    const updatedCart = items.filter((item) => item.product.id !== productId);
    saveCartToDB(updatedCart);
    return updatedCart;
  });
};

export const increaseQuantity = (productId: string): void => {
  cart.update((items) => {
    const updatedCart = items.map((item) =>
      item.product.id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    saveCartToDB(updatedCart);
    return updatedCart;
  });
};

export const decreaseQuantity = (productId: string): void => {
  cart.update((items) => {
    const updatedCart = items
      .map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);
    saveCartToDB(updatedCart);
    return updatedCart;
  });
};

export const clearCart = (): void => {
  cart.set([]);
  clearCartFromDB();
};

// Inicializa o estado do carrinho ao carregar o app
loadCartFromDB();
