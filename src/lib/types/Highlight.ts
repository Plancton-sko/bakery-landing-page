import type { Product } from "$lib/types/Product";

export type Highlight = Product & {
    isActive: boolean; // Propriedade que indica se o destaque está ativo
};
