// src/routes/api/highlights/[id]/+server.ts
import { json, type RequestHandler } from '@sveltejs/kit';

const baseUrl = import.meta.env.VITE_BASE_URL;

export const GET: RequestHandler = async ({ params, cookies }) => {
    try {
        const sessionId = cookies.get('app.sid');
        
        const response = await fetch(`${baseUrl}/highlights/${params.id}`, {
            method: 'GET',
            headers: {
                'Cookie': sessionId ? `session=${sessionId}` : '',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const highlight = await response.json();
        return json(highlight);
    } catch (error) {
        console.error('Error fetching highlight:', error);
        return json({ error: 'Failed to fetch highlight' }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ params, cookies }) => {
    try {
        const sessionId = cookies.get('app.sid');
        
        const response = await fetch(`${baseUrl}/highlights/${params.id}`, {
            method: 'DELETE',
            headers: {
                'Cookie': sessionId ? `session=${sessionId}` : '',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return json({ success: true });
    } catch (error: unknown) {
        console.error('Error deleting highlight:', error);
        const message = error instanceof Error ? error.message : 'Failed to delete highlight';
        return json({ error: message }, { status: 500 });
    }
};