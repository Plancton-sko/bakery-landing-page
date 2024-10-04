// src/routes/api/products/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { products } from '$lib/consts/Products'; // Mock de produtos

export const GET: RequestHandler = async () => {
  return json(products);
};
