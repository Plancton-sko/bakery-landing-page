// src/routes/api/highlights/+server.ts
import { json, type RequestHandler } from '@sveltejs/kit';

const baseUrl = import.meta.env.VITE_BASE_URL;

export const GET: RequestHandler = async ({ cookies }) => {
    try {
        const sessionId = cookies.get('app.sid');

        const response = await fetch(`${baseUrl}/highlights`, {
            method: 'GET',
            headers: {
                'Cookie': sessionId ? `session=${sessionId}` : '',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const highlights = await response.json();
        return json(highlights);
    } catch (error: unknown) {
        console.error('Error fetching highlights:', error);

        const message = error instanceof Error ? error.message : 'Failed to fetch highlights';
        return json({ error: message }, { status: 500 });
    }
};

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const sessionId = cookies.get('app.sid');
        const body = await request.json();

        const response = await fetch(`${baseUrl}/highlights`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': sessionId ? `session=${sessionId}` : '',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return json(result);
    } catch (error: unknown) {
        console.error('Error updating highlights:', error);

        const message = error instanceof Error ? error.message : 'Failed to update highlights';
        return json({ error: message }, { status: 500 });
    }
};