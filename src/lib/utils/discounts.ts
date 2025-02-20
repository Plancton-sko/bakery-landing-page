// src/lib/utils/discounts.ts
import type { DiscountRule, AppliedDiscount } from "$lib/types/Discount";
import type { Product } from "$lib/types/Product";

export function calculateDiscounts(
    product: Product,
    rules: DiscountRule[]
): AppliedDiscount | undefined { // Retornando undefined em vez de null
    const applicableRules = rules.filter(rule =>
        (rule.applyTo.categories?.includes(product.category)) ||
        (rule.applyTo.productIds?.includes(product.id))
    );

    if (applicableRules.length === 0) return undefined;

    const bestDiscount = applicableRules[0];
    return applyDiscount(product.price, bestDiscount);
}

function applyDiscount(originalPrice: number, rule: DiscountRule): AppliedDiscount {
    switch (rule.type) {
        case 'percentage':
            return {
                originalPrice,
                finalPrice: originalPrice * (1 - rule.value / 100),
                discountAmount: originalPrice * (rule.value / 100),
                discountType: 'percentage'
            };
        case 'fixed':
            return {
                originalPrice,
                finalPrice: Math.max(originalPrice - rule.value, 0), // Preço não pode ser negativo
                discountAmount: rule.value,
                discountType: 'fixed'
            };
        default:
            throw new Error('Tipo de desconto não suportado');
    }
}