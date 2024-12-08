//src/lib/const/Product.ts
import { Categories } from "$lib/enums/Categories";
import type { Product } from "$lib/types/Product";

export let products: Product[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'White Flour Bread',
      description: 'Fresh bread made with white flour, ideal for accompanying meals or making sandwiches.',
      price: 4.90,
      category: Categories.BREAD,
      image: '/images/white-flour-bread.webp'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Whole Wheat Bread',
      description: 'Healthy and tasty bread, made with whole wheat flour for a rustic touch.',
      price: 5.90,
      category: Categories.BREAD,
      image: '/images/wholemeal-bread.webp'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Spelt Flour Bread',
      description: 'Made with spelt flour, this bread offers a light flavor and unique texture.',
      price: 6.90,
      category: Categories.BREAD,
      image: '/images/spelled-flour-bread.webp'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Assorted Breads and Rolls',
      description: 'A variety of fresh breads and rolls, ideal for gatherings and celebrations.',
      price: 8.00,
      category: Categories.BREAD,
      image: '/images/breads-rolls.webp'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      name: 'Espresso',
      description: 'Classic espresso, perfect for a quick boost or to accompany a dessert.',
      price: 3.50,
      category: Categories.COFFEE,
      image: '/images/espresso.webp'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440005',
      name: 'Cappuccino',
      description: 'Creamy coffee with steamed milk and foam, perfect to start the day.',
      price: 4.00,
      category: Categories.COFFEE,
      image: '/images/cappuccino.webp'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440006',
      name: 'Chocolate Chip Cookies',
      description: 'Delicious, crispy cookies with generous chocolate chunks.',
      price: 2.50,
      category: Categories.COOKIES,
      image: '/images/chocolate-chip-cookies.webp'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440007',
      name: 'Macarons',
      description: 'Delicate French macarons, available in a variety of flavors and colors.',
      price: 5.00,
      category: Categories.COOKIES,
      image: '/images/macarons.webp'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440008',
      name: 'Custom Cake',
      description: 'Customized cake for birthdays and special celebrations, decorated to your preference.',
      price: 100.00,
      category: Categories.OTHERS,
      image: '/images/custom-cake.webp'
    }
];
