// src/lib/const/Slide.ts
interface Slide {
    src: string;
    alt: string;
    title: string;
    description: string;
    ctaButton: string;
    ctaText: string;
  }

  
export const slides: Slide[] = [
  {
    src: "/images/angelo-pantazis.webp",
    alt: "Delicious artisan bread",
    title: "Artisan Bread",
    description: "Experience the taste of freshly baked, handcrafted bread.",
    ctaText: "Learn More",
    ctaButton: "/#",
  },
  {
    src: "/images/clark-young.webp",
    alt: "Freshly baked croissants",
    title: "Flaky Croissants",
    description: "Enjoy our buttery, flaky croissants every morning.",
    ctaText: "Order Croissants",
    ctaButton: "/#",
  },
  {
    src: "/images/ddp-CceG6jpl19M-unsplash.jpg",
    alt: "Sourdough bread on display",
    title: "Sourdough Specialties",
    description: "Our sourdough is made with love and a long fermentation process.",
    ctaText: "Explore Sourdough",
    ctaButton: "/#",
  },
  ];