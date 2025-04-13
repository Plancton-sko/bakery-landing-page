// src/routes/api/products/+server.ts
// import { json } from '@sveltejs/kit';
// import { getAllProducts, addProduct } from '$lib/server/db';
// import type { RequestHandler } from './$types';

// export const GET: RequestHandler = () => {
//   return json(getAllProducts());
// };

// export const POST: RequestHandler = async ({ request }) => {
//   const product = await request.json();

//   // Aqui você pode validar e sanitizar o base64 se quiser.
//   if (!product.image?.startsWith('data:image')) {
//     return new Response('Imagem inválida.', { status: 400 });
//   }

//   addProduct(product);
//   return json(product);
// };
