// src/lib/const/Highlights.ts
import { Categories } from "$lib/enums/Categories";
import type { Highlight } from "$lib/types/Highlight";

export const highlights: Highlight[] = [
    {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'White flour bread',
        price: 2490,
        category: Categories.BREAD,
        image: '/images/white-flour-bread.webp',
        isActive: true
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Wholemeal bread',
        price: 3590,
        category: Categories.BREAD,
        image: '/images/wholemeal-bread.webp',
        isActive: false
    }
];
