import { request } from './request.js';

export const AlmoxarifeAPI = {
    getArmazem: () => request('almoxarife/armazem', 'GET'),
    getPressEstoque: () => request('almoxarife/PressEstoque', 'GET'),
    getPedidos: () => request('almoxarife/pedidos', 'GET'),
    
    
    postPdfEmail: (dadosParaEnvio) => request('SendEmail/send', 'POST', dadosParaEnvio),

    getControleEstoque: (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio);
    if (filtros.dataFim) params.append('dataFim', filtros.dataFim);
    if (filtros.tipo && filtros.tipo !== 'todos') params.append('tipo', filtros.tipo);
    return request(`almoxarife/ControleEstoque?${params.toString()}`, 'GET');
},
};