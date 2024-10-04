import { writable, type Writable } from 'svelte/store';
import type { Product, ProductStore } from '$lib/types/Product';

// Função para criar a store de produtos
function createProductsStore(): ProductStore {
  const { subscribe, set, update } = writable<Product[]>([]);

  // Função para buscar produtos da API (GET)
  async function fetchProducts() {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Erro ao buscar produtos.');
      const data: Product[] = await response.json();
      set(data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  }

  // Função para adicionar um produto (POST)
  async function addProduct(product: Product) {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });

      if (!response.ok) throw new Error('Erro ao adicionar produto.');
      const newProduct: Product = await response.json();
      update((products) => [...products, newProduct]);
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    }
  }

  // Função para atualizar um produto (PUT)
  async function updateProduct(updatedProduct: Product) {
    try {
      const response = await fetch(`/api/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });

      if (!response.ok) throw new Error('Erro ao atualizar produto.');
      update((products) =>
        products.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    }
  }

  // Função para deletar um produto (DELETE)
  async function deleteProduct(id: string) {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao deletar produto.');
      update((products) => products.filter((product) => product.id !== id));
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
    }
  }

  // Função para adicionar um produto localmente (sem chamada à API)
  function addLocalProduct(product: Product) {
    update((products) => [...products, product]);
  }

  // Função para atualizar um produto localmente (sem chamada à API)
  function updateLocalProduct(updatedProduct: Product) {
    update((products) =>
      products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  }

  // Função para deletar um produto localmente (sem chamada à API)
  function deleteLocalProduct(id: string) {
    update((products) => products.filter((product) => product.id !== id));
  }

  return {
    subscribe,
    set,
    update,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    addLocalProduct,
    updateLocalProduct,
    deleteLocalProduct,
  };
}

export const products = createProductsStore();
