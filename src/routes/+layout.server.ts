// src/routes/+layout.server.ts
import type { Product } from '$lib/types/Product';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch }) => {
  const response = await fetch('/api/products');
  
  if (!response.ok) {
    throw new Error('Erro ao carregar produtos');
  }

  const products: Product[] = await response.json();
  
  return {
    products
  };
};