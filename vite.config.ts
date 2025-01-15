import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';


export default defineConfig({
	plugins: [
		sveltekit(),
		enhancedImages()
	],
	css: {
		preprocessorOptions: {
		  css: {
			additionalData: `@import 'src/styles/global.css';`
		  }
		}
	  }
});
