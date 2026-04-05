import { API_BASE_URL, FETCH_OPTIONS } from './config.js';

export const request = async (endpoint, method, body = null) => {
    try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...FETCH_OPTIONS,
            method,
            body: body ? JSON.stringify(body) : null
        });

        if (!res.ok) {
            const errorPayload = await res.json().catch(() => null);
            throw new Error(errorPayload?.error || `Erro na requisição: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error(`[MestreDeObrasAPI] ${endpoint}:`, error.message);
        throw error;
    }
};