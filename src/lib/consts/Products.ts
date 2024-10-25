import { Categories } from "$lib/enums/Categories";
import type { Product } from "$lib/types/Product";

export let products: Product[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Pão de farinha branca',
      description: 'Pão fresco feito com farinha branca, ideal para acompanhar refeições ou fazer sanduíches.',
      price: 4.90,
      category: Categories.BREAD,
      image: '/images/white-flour-bread.jpg'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Pão integral',
      description: 'Pão saudável e saboroso, preparado com farinha integral para um toque rústico.',
      price: 5.90,
      category: Categories.BREAD,
      image: '/images/wholemeal-bread.jpg'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Pão de farinha de espelta',
      description: 'Feito com farinha de espelta, este pão oferece um sabor leve e textura única.',
      price: 6.90,
      category: Categories.BREAD,
      image: '/images/spelled-flour-bread.jpg'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Seleção de pães e pãezinhos',
      description: 'Uma variedade de pães e pãezinhos frescos, ideais para reuniões e celebrações.',
      price: 8.00,
      category: Categories.BREAD,
      image: '/images/breads-rolls.jpg'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      name: 'Expresso',
      description: 'Café expresso clássico, perfeito para um rápido estímulo ou para acompanhar uma sobremesa.',
      price: 3.50,
      category: Categories.COFFEE,
      image: '/images/espresso.jpg'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440005',
      name: 'Cappuccino',
      description: 'Café cremoso com leite vaporizado e espuma, perfeito para começar o dia.',
      price: 4.00,
      category: Categories.COFFEE,
      image: '/images/cappuccino.jpg'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440006',
      name: 'Cookies de gotas de chocolate',
      description: 'Deliciosos cookies crocantes com pedaços generosos de chocolate.',
      price: 2.50,
      category: Categories.COOKIES,
      image: '/images/chocolate-chip-cookies.jpg'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440007',
      name: 'Macarons',
      description: 'Macarons franceses delicados, disponíveis em diversos sabores e cores.',
      price: 5.00,
      category: Categories.COOKIES,
      image: '/images/macarons.jpg'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440008',
      name: 'Bolo personalizado',
      description: 'Bolo customizado para aniversários e celebrações especiais, decorado conforme sua preferência.',
      price: 100.00,
      category: Categories.OTHERS,
      image: '/images/custom-cake.jpg'
    }
];
