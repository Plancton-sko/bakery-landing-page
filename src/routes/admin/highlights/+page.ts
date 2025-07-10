// src/routes/admin/highlights/+page.ts
import type { PageLoad } from "../../$types";
import { config } from '$lib/services/config';

export const load: PageLoad = async ({ fetch }) => {
    try {
        // Pré-carregar produtos para melhor UX
        const productsResponse = await fetch(`${config.baseUrl}/products`, {
            credentials: 'include'
        });
        const products = productsResponse.ok ? await productsResponse.json() : [];

        return {
            products
        };
    } catch (error) {
        console.error('Erro ao pré-carregar dados:', error);
        return {
            products: []
        };
    }
};