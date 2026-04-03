import { API_BASE_URL, FETCH_OPTIONS } from './config.js';

export const AlmoxarifeAPI = {
    getArmazem: async () => {
        const res = await fetch(`${API_BASE_URL}/armazem/armazemCentral`, {
            ...FETCH_OPTIONS,
            method: 'GET'
        });
        
        if (!res.ok) throw new Error(`Erro na requisição: ${res.status}`);
        
        return res.json();
    }
};