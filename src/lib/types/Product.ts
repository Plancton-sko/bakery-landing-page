// src/lib/types/Product.ts

import type { Categories } from "$lib/enums/Categories";
import type { Writable } from "svelte/store";
import type { Picture } from "vite-imagetools";

export type Product = {
    id: string;
    name: string;
    price: number;
    category: Categories;
    image: string | Picture;
    description: string;
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
  