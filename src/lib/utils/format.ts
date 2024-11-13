//src/lib/utils/format.ts
export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(price);
};