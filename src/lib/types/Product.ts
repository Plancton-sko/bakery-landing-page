// src/lib/types/Product.ts
import type { Categories } from "$lib/consts/Categories";
import type { Writable } from "svelte/store";
import type { Picture } from "vite-imagetools";

export type ProductImage = {
  id: string;
  format: 'avif' | 'webp' | 'jpeg';
  size: 'thumbnail' | 'small' | 'medium' | 'large' | 'original';
  url: string;
  width: number;
  height: number;
  fileSize: number;
  quality: number;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  category: Categories;
  image: string | Picture; // usada como fallback
  imagePath?: Picture;
  description: string;
  images?: ProductImage[]; // imagens otimizadas vindas do backend
};

export type ProductStore = Writable<Product[]> & {
  fetchProducts: () => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (updatedProduct: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addLocalProduct: (product: Product) => void;
  updateLocalProduct: (updatedProduct: Product) => void;
  deleteLocalProduct: (id: string) => void;
};
