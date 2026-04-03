import { API_BASE_URL, FETCH_OPTIONS } from './config.js';

export const AlmoxarifeAPI = {
    getArmazem: async () => {
        try {
            const res = await fetch(`${API_BASE_URL}armazem/armazemCentral`, {
                ...FETCH_OPTIONS,
                method: 'GET'
            });

            if (!res.ok) throw new Error(`Erro na requisição: ${res.status}`);

            return await res.json();
        } catch (error) {
            console.error('[AlmoxarifeAPI] getArmazem:', error.message);
            throw error;
        }
    },

    getPressEstoque: async () => {
        try{
            const res = await fetch(`${API_BASE_URL}armazem/PressEstoque`, {
                ...FETCH_OPTIONS,
                method: 'GET'
            });

            if (!res.ok) throw new Error(`Erro na requisição: ${res.status}`);

            return await res.json();
        } catch (error) {
            console.error('[AlmoxarifeAPI] getPressEstoque:', error.message);
            throw error;
        }
    }
};