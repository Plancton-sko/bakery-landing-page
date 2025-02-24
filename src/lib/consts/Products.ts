//src/lib/const/Product.ts
import { Categories } from "$lib/enums/Categories";
import type { Product } from "$lib/types/Product";

import whiteBread from '$lib/assets/images/white-flour-bread.webp?enhanced';
import wholeMeal from '$lib/assets/images/wholemeal-bread.webp?enhanced';
import spelledFlour from '$lib/assets/images/spelled-flour-bread.webp?enhanced';
import espresso from '$lib/assets/images/breads-rolls.webp?enhanced';
import cappuccino from '$lib/assets/images/cappuccino.webp?enhanced';
import chocolateChip from '$lib/assets/images/chocolate-chip-cookies.webp?enhanced';
import breadsRolls from '$lib/assets/images/breads-rolls.webp?enhanced';
import macarons from '$lib/assets/images/macarons.webp?enhanced';
import customCake from '$lib/assets/images/custom-cake.webp?enhanced';

export let products: Product[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'White Flour Bread',
      description: 'Fresh bread made with white flour, ideal for accompanying meals or making sandwiches.',
      price: 4.90,
      category: Categories.BREAD,
      image: whiteBread
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Whole Wheat Bread',
      description: 'Healthy and tasty bread, made with whole wheat flour for a rustic touch.',
      price: 5.90,
      category: Categories.BREAD,
      image: wholeMeal
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Spelt Flour Bread',
      description: 'Made with spelt flour, this bread offers a light flavor and unique texture.',
      price: 6.90,
      category: Categories.BREAD,
      image: spelledFlour
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Assorted Breads and Rolls',
      description: 'A variety of fresh breads and rolls, ideal for gatherings and celebrations.',
      price: 8.00,
      category: Categories.BREAD,
      image: breadsRolls
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      name: 'Espresso',
      description: 'Classic espresso, perfect for a quick boost or to accompany a dessert.',
      price: 3.50,
      category: Categories.COFFEE,
      image: espresso
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440005',
      name: 'Cappuccino',
      description: 'Creamy coffee with steamed milk and foam, perfect to start the day.',
      price: 4.00,
      category: Categories.COFFEE,
      image: cappuccino
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440006',
      name: 'Chocolate Chip Cookies',
      description: 'Delicious, crispy cookies with generous chocolate chunks.',
      price: 2.50,
      category: Categories.COOKIES,
      image: chocolateChip
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440007',
      name: 'Macarons',
      description: 'Delicate French macarons, available in a variety of flavors and colors.',
      price: 5.00,
      category: Categories.COOKIES,
      image: macarons
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440008',
      name: 'Custom Cake',
      description: 'Customized cake for birthdays and special celebrations, decorated to your preference.',
      price: 100.00,
      category: Categories.OTHERS,
      image: customCake
    }
];
