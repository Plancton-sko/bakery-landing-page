//src/lib/consts/Slides.ts
import type { Slide } from '$lib/types/Slides';
import angeloPantazis from '$lib/assets/images/angelo-pantazis.webp?enhanced'
import clarkYoung from '$lib/assets/images/clark-young.webp?enhanced'
import ddp from '$lib/assets/images/ddp.jpg?enhanced'

export const slides: Slide[] = [
  {
    src: angeloPantazis,
    alt: "Delicious artisan bread",
    title: "Artisan Bread",
    description: "Experience the taste of freshly baked, handcrafted bread.",
    ctaText: "Learn More",
    ctaButton: "/#",
  },
  {
    src: clarkYoung,
    alt: "Freshly baked croissants",
    title: "Flaky Croissants",
    description: "Enjoy our buttery, flaky croissants every morning.",
    ctaText: "Order Croissants",
    ctaButton: "/#",
  },
  {
    src: ddp,
    alt: "Sourdough bread on display",
    title: "Sourdough Specialties",
    description: "Our sourdough is made with love and a long fermentation process.",
    ctaText: "Explore Sourdough",
    ctaButton: "/#",
  },
];