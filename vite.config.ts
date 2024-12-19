import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';


export default defineConfig({
	plugins: [
		sveltekit(),
	],
	css: {
		preprocessorOptions: {
		  css: {
			additionalData: `@import 'src/styles/global.css';`
		  }
		}
	  }
});
