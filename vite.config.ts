// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import convertImagesPlugin from './vite-plugin-convert-images';
import { defineConfig } from 'vite';


export default defineConfig({
	plugins: [
		enhancedImages(),
		sveltekit(),
		// convertImagesPlugin({
		// 	apiUrl: 'http://localhost:3000/products?page=1'
		// })
	],
	css: {
		preprocessorOptions: {
			css: {
				additionalData: `@import 'src/styles/global.css';`
			}
		}
	},
	ssr: {
		noExternal: ['idb-keyval'],
	},
});
