// src/lib/utils/imageLoader.ts
export interface ImageData {
    src: string;
    alt: string;
    title: string;
    description: string;
    ctaText: string;
    ctaButton: string;
  }
  
  const imageModules = import.meta.glob(
    '/src/assets/images/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp,svg}',
    {
      eager: true,
      query: { enhanced: true }
    }
  );
  
  export const loadSlides = (): ImageData[] => {
    return Object.entries(imageModules).map(([path, module]) => ({
      src: module.default,
      alt: 'Descrição da imagem', // Você pode personalizar ou extrair esses dados
      title: 'Título da imagem',
      description: 'Descrição detalhada',
      ctaText: 'Clique aqui',
      ctaButton: '/#'
    }));
  };
  