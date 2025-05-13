// src/routes/api/logout/+server.ts
import { redirect } from '@sveltejs/kit';

export const POST = () => {
  return new Response(null, {
    status: 303,
    headers: {
      'Set-Cookie': `app.sid=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
    },
   
  });
};
