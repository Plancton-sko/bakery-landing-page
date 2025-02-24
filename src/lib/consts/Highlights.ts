// src/lib/const/Highlights.ts
import { Categories } from "$lib/enums/Categories";
import type { Highlight } from "$lib/types/Highlight";

import whiteFlour from '$lib/assets/images/white-flour-bread.webp?enhanced';
import wholeMeal from '$lib/assets/images/wholemeal-bread.webp?enhanced';

export const highlights: Highlight[] = [
    {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'White flour bread',
        price: 2490,
        category: Categories.BREAD,
        image: whiteFlour,
        isActive: true
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Wholemeal bread',
        price: 3590,
        category: Categories.BREAD,
        image: wholeMeal,
        isActive: false
    }
];
