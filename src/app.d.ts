// src/app.d.ts
/// <reference types="@sveltejs/kit" />

declare global {
	namespace App {
		interface Locals {
			/** o ID da sessão (cookie) enviado pelo NestJS */
			sessionId: string | null;
			/** opcional: só se você quiser guardar o user após fetch posterior */
			user?: import('$lib/types').User | null;
		}
	}
}


export { };
