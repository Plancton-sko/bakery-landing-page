// src/routes/+layout.server.ts
import { config } from '$lib/services/config';
import type { LayoutServerLoad } from './$types';
import type { Product } from '$lib/types/Product';

export const load: LayoutServerLoad = async ({ fetch, locals }) => {
  const baseUrl = config.baseUrl;

  const user = locals.user; // <<< já vem do hook, não precisa buscar de novo

  const res = await fetch(`${baseUrl}/products`, {
    credentials: 'include'
  });

  if (!res.ok) {
    console.error('Falha ao buscar produtos', await res.text());
    return { products: [], user };
  }

  const data = await res.json();

  const products: Product[] = data.map((p: any) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    description: p.description,
    price: Number(p.price),
    image: p.image
  }));

  return {
    user,
    products
  };
};
