// import { Categories } from '$lib/enums/Categories';
// import { config } from '$lib/services/config';
// import type { Product } from '$lib/types/Product';
// import type { PageServerLoad } from './$types';

// export const load: PageServerLoad = async ({ fetch }) => {
//   // Busca os produtos da API
//   const baseUrl = config.baseUrl;
//   console.log(baseUrl);
  
//   const res = await fetch(baseUrl + '/products');
//   console.log(res);
  
//   const data = await res.json();
//   console.log(data);
  
//   // Converte o preço de Decimal (se vier como string) para number
//   const products = data.map((product: Product) => ({
//     id: product.id,
//     name: product.name,
//     category: product.category,
//     description: product.description,
//     price: Number(product.price),
//     image: product.image // A imagem vem como base64
//   }));
  
//   return { products };
// };