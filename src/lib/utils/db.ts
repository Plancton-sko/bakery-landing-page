// src/lib/utils/db.ts
import { set, get, del, clear, keys } from 'idb-keyval';

/**
 * Save data to a specified key in IndexedDB.
 * @param key - The key to associate the data with.
 * @param value - The data to store.
 */
export const saveToDB = async <T>(key: string, value: T): Promise<void> => {
  try {
    await set(key, value);
  } catch (error) {
    console.error(`Failed to save to DB: ${error}`);
  }
};

/**
 * Retrieve data from IndexedDB by key.
 * @param key - The key to retrieve the data for.
 * @returns The stored data, or null if not found.
 */
export const getFromDB = async <T>(key: string): Promise<T | null> => {
  try {
    return await get<T>(key);
  } catch (error) {
    console.error(`Failed to retrieve from DB: ${error}`);
    return null;
  }
};

/**
 * Delete data from IndexedDB by key.
 * @param key - The key to delete the data for.
 */
export const deleteFromDB = async (key: string): Promise<void> => {
  try {
    await del(key);
  } catch (error) {
    console.error(`Failed to delete from DB: ${error}`);
  }
};

/**
 * Clear all data from IndexedDB.
 */
export const clearDB = async (): Promise<void> => {
  try {
    await clear();
  } catch (error) {
    console.error(`Failed to clear DB: ${error}`);
  }
};

/**
 * List all keys in IndexedDB.
 * @returns An array of all keys.
 */
export const listDBKeys = async (): Promise<string[]> => {
  try {
    return await keys();
  } catch (error) {
    console.error(`Failed to list keys in DB: ${error}`);
    return [];
  }
};

// src/lib/stores/cart.ts
import { writable, derived } from 'svelte/store';
import { saveToDB, getFromDB, deleteFromDB, clearDB } from '$lib/utils/db';
import type { Product } from '$lib/types/Product';

interface CartItem {
  product: Product;
  quantity: number;
}

const CART_KEY = 'cart';

// Store to manage the cart items
export const cart = writable<CartItem[]>([], set => {
  // Load cart items from IndexedDB on initialization
  (async () => {
    const storedCart = await getFromDB<CartItem[]>(CART_KEY);
    set(storedCart || []);
  })();
});

// Derived store to calculate the total price
export const totalPrice = derived(cart, $cart =>
  $cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
);

/**
 * Add an item to the cart and persist it to IndexedDB.
 * @param product - The product to add.
 * @param quantity - The quantity of the product to add.
 */
export const addToCart = (product: Product, quantity: number = 1): void => {
  cart.update(items => {
    const existingItem = items.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.push({ product, quantity });
    }
    saveToDB(CART_KEY, items);
    return items;
  });
};

/**
 * Remove an item from the cart and update IndexedDB.
 * @param productId - The ID of the product to remove.
 */
export const removeFromCart = (productId: string): void => {
  cart.update(items => {
    const updatedCart = items.filter(item => item.product.id !== productId);
    saveToDB(CART_KEY, updatedCart);
    return updatedCart;
  });
};

/**
 * Clear all items from the cart and IndexedDB.
 */
export const clearCart = (): void => {
  cart.set([]);
  deleteFromDB(CART_KEY);
};

/**
 * Increase the quantity of a product in the cart.
 * @param productId - The ID of the product to increase.
 */
export const increaseQuantity = (productId: string): void => {
  cart.update(items => {
    const item = items.find(i => i.product.id === productId);
    if (item) item.quantity++;
    saveToDB(CART_KEY, items);
    return items;
  });
};

/**
 * Decrease the quantity of a product in the cart.
 * @param productId - The ID of the product to decrease.
 */
export const decreaseQuantity = (productId: string): void => {
  cart.update(items => {
    const item = items.find(i => i.product.id === productId);
    if (item && item.quantity > 1) item.quantity--;
    saveToDB(CART_KEY, items);
    return items;
  });
};
