// vite-plugin-convert-images.js
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch'; // ou use o fetch nativo, se disponível

export default function convertImagesPlugin(options = {}) {
  return {
    name: 'convert-images-plugin',
    async buildStart() {
      try {
        // URL da sua API
        const res = await fetch(options.apiUrl || 'http://localhost:3000/products?page=1');
        if (!res.ok) throw new Error('Erro ao buscar produtos');
        const { data } = await res.json();

        const staticDir = path.join(process.cwd(), 'static', 'images');
        if (!fs.existsSync(staticDir)) {
          fs.mkdirSync(staticDir, { recursive: true });
        }

        data.forEach((product, index) => {
          if (typeof product.image === 'string' && product.image.startsWith('data:image')) {
            const base64Data = product.image.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            const fileName = `product-${product.id || index}.png`;
            const filePath = path.join(staticDir, fileName);
            fs.writeFileSync(filePath, buffer);
            console.log(`Imagem convertida: ${fileName}`);
          }
        });
        console.log('Conversão de imagens finalizada.');
      } catch (error) {
        console.error('Erro no plugin de conversão de imagens:', error);
      }
    }
  };
}
