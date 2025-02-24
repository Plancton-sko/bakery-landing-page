// src/lib/types/Slides.ts
import type { Picture } from "vite-imagetools";

export interface Slide {
  src: string | Picture;
  alt: string;
  title: string;
  description: string;
  ctaButton: string;
  ctaText: string;
}
