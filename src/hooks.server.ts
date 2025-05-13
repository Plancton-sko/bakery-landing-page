import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // 1) pega o cookie HttpOnly “app.sid”
  const sessionId = event.cookies.get('app.sid') ?? null;
  event.locals.sessionId = sessionId;

  // 2) se for rota /admin e não tiver sessão => login
  if (
    event.url.pathname.startsWith('/admin') &&
    !sessionId
  ) {
    throw redirect(303, '/login');
  }

  return await resolve(event);
};