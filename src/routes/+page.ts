// src/routes/+page.ts
export const load = async () => {
  try {
    const res = await fetch('http://localhost:3000');
    const data = await res.json();
    return { data };
  } catch (error) {
    console.error('API indisponível:', error);
    return { data: [] }; // fallback
  }
};

export const prerender = false;