import { request } from './request.js';

export const MestreDeObrasAPI = {
    getUnidades: (filtros = {}) => {
        const params = new URLSearchParams();
        if (filtros.busca) params.append('busca', filtros.busca);
        if (filtros.etapa) params.append('etapa', filtros.etapa);
        if (filtros.status) params.append('status', filtros.status);
        if (filtros.lider) params.append('lider', filtros.lider);
        return request(`mestre-de-obras/unidades?${params.toString()}`, 'GET');
    },

    getUnidadeDetalhe: (idUnidade) =>
        request(`mestre-de-obras/unidades/${idUnidade}`, 'GET'),

    getUnidadeVisaoGeral: (idUnidade) =>
        request(`mestre-de-obras/unidades/${idUnidade}/visao-geral`, 'GET'),

    getOcorrencias: (idUnidade, filtros = {}) => {
        const params = new URLSearchParams();
        if (filtros.status) params.append('status', filtros.status);
        if (filtros.codigo) params.append('codigo', filtros.codigo);
        if (filtros.data) params.append('data', filtros.data);
        return request(`mestre-de-obras/unidades/${idUnidade}/ocorrencias?${params.toString()}`, 'GET');
    },

    criarOcorrencia: (idUnidade, payload) =>
        request(`mestre-de-obras/unidades/${idUnidade}/ocorrencias`, 'POST', payload),

    atualizarOcorrencia: (idOcorrencia, payload) =>
        request(`mestre-de-obras/ocorrencias/${idOcorrencia}`, 'PUT', payload),

    atualizarStatusOcorrencia: (idOcorrencia, status) =>
        request(`mestre-de-obras/ocorrencias/${idOcorrencia}/status`, 'PATCH', { status }),

    deletarOcorrencia: (idOcorrencia) =>
        request(`mestre-de-obras/ocorrencias/${idOcorrencia}`, 'DELETE'),

    getSolicitacoes: (idUnidade, filtros = {}) => {
        const params = new URLSearchParams();
        if (filtros.status) params.append('status', filtros.status);
        if (filtros.codigo) params.append('codigo', filtros.codigo);
        if (filtros.data) params.append('data', filtros.data);
        return request(`mestre-de-obras/unidades/${idUnidade}/solicitacoes?${params.toString()}`, 'GET');
    },

    criarSolicitacao: (idUnidade, payload) =>
        request(`mestre-de-obras/unidades/${idUnidade}/solicitacoes`, 'POST', payload),

    atualizarSolicitacao: (idSolicitacao, payload) =>
        request(`mestre-de-obras/solicitacoes/${idSolicitacao}`, 'PUT', payload),

    atualizarStatusSolicitacao: (idSolicitacao, status) =>
        request(`mestre-de-obras/solicitacoes/${idSolicitacao}/status`, 'PATCH', { status }),

    deletarSolicitacao: (idSolicitacao) =>
        request(`mestre-de-obras/solicitacoes/${idSolicitacao}`, 'DELETE'),

    getEquipe: (idUnidade, filtros = {}) => {
        const params = new URLSearchParams();
        if (filtros.funcao) params.append('funcao', filtros.funcao);
        if (filtros.nome) params.append('nome', filtros.nome);
        if (filtros.status) params.append('status', filtros.status);
        return request(`mestre-de-obras/unidades/${idUnidade}/equipe?${params.toString()}`, 'GET');
    },

    alocarTrabalhador: (idUnidade, idColaborador) =>
        request(`mestre-de-obras/unidades/${idUnidade}/equipe`, 'POST', { id_colaborador: idColaborador }),

    retirarTrabalhador: (idUnidade, idColaborador) =>
        request(`mestre-de-obras/unidades/${idUnidade}/equipe/${idColaborador}`, 'DELETE'),

    atualizarEtapaUnidade: (idUnidade, idEtapaAtual) =>
        request(`mestre-de-obras/unidades/${idUnidade}/etapa`, 'PATCH', { id_etapa_atual: idEtapaAtual }),

    getMateriaisDisponiveis: () =>
        request(`mestre-de-obras/materiais`, 'GET'),

    getColaboradoresDisponiveis: () =>
        request(`mestre-de-obras/colaboradores`, 'GET'),

    getEtapas: () =>
        request(`mestre-de-obras/etapas`, 'GET')
};