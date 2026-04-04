import { API_BASE_URL, FETCH_OPTIONS } from './config.js';

const request = async (endpoint, method, body = null) => {
    try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...FETCH_OPTIONS,
            method,
            body: body ? JSON.stringify(body) : null
        });

        if (!res.ok) throw new Error(`Erro na requisição: ${res.status}`);

        return await res.json();
    } catch (error) {
        console.error(`[AlmoxarifeAPI] ${endpoint}:`, error.message);
        throw error;
    }
};

export const AlmoxarifeAPI = {
    getArmazem: () => request('almoxarife/armazem', 'GET'),
    getPressEstoque: () => request('almoxarife/PressEstoque', 'GET'),
    getPedidos: () => request('almoxarife/pedidos', 'GET'),
    
    
    postPdfEmail: (dadosParaEnvio) => request('SendEmail/send', 'POST', dadosParaEnvio)
};