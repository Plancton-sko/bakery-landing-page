// src/lib/types/Highlight.ts
import type { Picture } from 'vite-imagetools';
import type { Product } from './Product';

export interface Highlight extends Partial<Product> {
  id: string;
  name: string;
  price: number;
  image: string | Picture;
  description?: string; 
  isActive?: boolean;
} 