// src/lib/consts/Discounts.ts
import { Categories } from "$lib/enums/Categories";
import type { DiscountRule } from "$lib/types/Discount";

export const activeDiscounts: DiscountRule[] = [
  {
    type: 'percentage',
    value: 15, // 15% de desconto
    applyTo: {
      categories: [Categories.BREAD]
    }
  },
  {
    type: 'fixed',
    value: 2, 
    applyTo: {
      productIds: ['550e8400-e29b-41d4-a716-446655440004'] // ID do Espresso
    }
  }
];