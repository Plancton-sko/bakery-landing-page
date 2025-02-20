// src/lib/types/Discount.ts
import type { Categories } from "$lib/enums/Categories";
export type DiscountType = 'percentage' | 'fixed';

export type DiscountRule = {
    type: DiscountType;
    value: number;
    applyTo: {
        categories?: Categories[];
        productIds?: string[];
    };
};

export type AppliedDiscount = {
    originalPrice: number;
    finalPrice: number;
    discountAmount: number;
    discountType: DiscountType;
};