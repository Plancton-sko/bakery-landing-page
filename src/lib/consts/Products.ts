import { Categories } from "$lib/enums/Categories";
import type { Product } from "$lib/types/Product";

export let products: Product[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'White flour bread',
      price: 2490,
      category: Categories.BREAD,
      image: '/images/white-flour-bread.jpg'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Wholemeal bread',
      price: 3590,
      category: Categories.BREAD,
      image: '/images/wholemeal-bread.jpg'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Bread from spelled flour',
      price: 4590,
      category: Categories.BREAD,
      image: '/images/spelled-flour-bread.jpg'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Selection of breads and rolls',
      price: 6000,
      category: Categories.BREAD,
      image: '/images/breads-rolls.jpg'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      name: 'Espresso',
      price: 350,
      category: Categories.COFFEE,
      image: '/images/espresso.jpg'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440005',
      name: 'Cappuccino',
      price: 400,
      category: Categories.COFFEE,
      image: '/images/cappuccino.jpg'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440006',
      name: 'Chocolate chip cookies',
      price: 250,
      category: Categories.COOKIES,
      image: '/images/chocolate-chip-cookies.jpg'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440007',
      name: 'Macarons',
      price: 500,
      category: Categories.COOKIES,
      image: '/images/macarons.jpg'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440008',
      name: 'Custom cake',
      price: 10000,
      category: Categories.OTHERS,
      image: '/images/custom-cake.jpg'
    }
];
