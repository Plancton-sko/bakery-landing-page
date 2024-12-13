
interface Slide {
    src: string;
    alt: string;
    title: string;
    description: string;
  }

  
export const slides: Slide[] = [
    {
      src: "/images/angelo-pantazis.jpg",
      alt: "Delicious artisan bread",
      title: "Artisan Bread",
      description: "Experience the taste of freshly baked, handcrafted bread."
    },
    {
      src: "/images/clark-young.jpg",
      alt: "Freshly baked croissants",
      title: "Flaky Croissants",
      description: "Enjoy our buttery, flaky croissants every morning."
    },
    {
      src: "/images/ddp-CceG6jpl19M-unsplash.jpg",
      alt: "Sourdough bread on display",
      title: "Sourdough Specialties",
      description: "Our sourdough is made with love and a long fermentation process."
    }
  ];