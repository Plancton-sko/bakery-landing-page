// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';


export default defineConfig({
	plugins: [
		enhancedImages(),
		sveltekit()
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
