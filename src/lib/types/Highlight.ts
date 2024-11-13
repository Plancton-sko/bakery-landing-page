// src/lib/types/Highlight.ts
import type { Product } from './Product';

export interface Highlight extends Partial<Product> {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string; 
  isActive?: boolean;
}