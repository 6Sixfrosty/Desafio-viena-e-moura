import { MestreDeObrasAPI } from '../../../shared/api/mestre-de-obras.js';

/* ====================================================================================================
                                            ESTADO
==================================================================================================== */

const state = {
    paginaAtual: 'construcao',
    unidadeSelecionada: null,
    abaAtiva: 'visao-geral',
    filtrosGrid: {
        busca: '',
        etapa: '',
        status: '',
        lider: ''
    },
    cache: {
        etapas: [],
        materiais: [],
        colaboradores: []
    }
};

/* ====================================================================================================
                                            INIT
==================================================================================================== */

document.addEventListener('DOMContentLoaded', async () => {
    await inicializarUnidades();
});

function esperarProximoFrame() {
    return new Promise(resolve => requestAnimationFrame(resolve));
}

async function esperarRenderizacao() {
    await esperarProximoFrame();
    await esperarProximoFrame();
}

async function inicializarUnidades() {
    configurarInterfaceUnidades();
    await esperarRenderizacao();
    await renderizarModuloUnidades();
}

/* ====================================================================================================
                                            UI
==================================================================================================== */

function configurarInterfaceUnidades() {
    configurarFiltrosGrid();
    configurarNavegacaoInternaUnidades();
    configurarAcoesGlobaisUnidades();
}

function configurarFiltrosGrid() {
    const btnFiltrar = document.getElementById('btnFiltrarUnidades');
    const btnLimpar = document.getElementById('btnLimparFiltrosUnidades');

    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', async () => {
            state.filtrosGrid.busca = document.getElementById('filterBuscaUnidade')?.value?.trim() || '';
            state.filtrosGrid.etapa = document.getElementById('filterEtapaUnidade')?.value || '';
            state.filtrosGrid.status = document.getElementById('filterStatusUnidade')?.value || '';
            state.filtrosGrid.lider = document.getElementById('filterLiderUnidade')?.value || '';

            await renderizarGridUnidades();
        });
    }

    if (btnLimpar) {
        btnLimpar.addEventListener('click', async () => {
            state.filtrosGrid = { busca: '', etapa: '', status: '', lider: '' };

            const busca = document.getElementById('filterBuscaUnidade');
            const etapa = document.getElementById('filterEtapaUnidade');
            const status = document.getElementById('filterStatusUnidade');
            const lider = document.getElementById('filterLiderUnidade');

            if (busca) busca.value = '';
            if (etapa) etapa.value = '';
            if (status) status.value = '';
            if (lider) lider.value = '';

            await renderizarGridUnidades();
        });
    }
}

function configurarNavegacaoInternaUnidades() {
    const btnVoltar = document.getElementById('btnVoltarGrid');
    const tabsNav = document.getElementById('detailTabsNav');

    if (btnVoltar) {
        btnVoltar.addEventListener('click', () => {
            mostrarGridUnidades();
        });
    }

    if (tabsNav) {
        tabsNav.addEventListener('click', async (event) => {
            const button = event.target.closest('[data-tab]');
            if (!button || !state.unidadeSelecionada) return;

            const tab = button.getAttribute('data-tab');
            state.abaAtiva = tab;
            ativarBotaoTab(tab);
            await renderizarAba(tab);
        });
    }
}

function configurarAcoesGlobaisUnidades() {
    document.addEventListener('click', async (event) => {
        const btnAbrirDetalhe = event.target.closest('[data-action="abrir-detalhe"]');
        if (btnAbrirDetalhe) {
            const card = btnAbrirDetalhe.closest('[data-unit-id]');
            const idUnidade = Number(card?.dataset.unitId);
            if (idUnidade) {
                await abrirDetalheUnidade(idUnidade);
            }
        }

        const btnNovaOcorrencia = event.target.closest('#btnNovaOcorrencia');
        if (btnNovaOcorrencia) abrirFormulario('ocorrencias');

        const btnNovaSolicitacao = event.target.closest('#btnNovaSolicitacao');
        if (btnNovaSolicitacao) abrirFormulario('solicitacoes');

        const btnCancelarNovaOcorrencia = event.target.closest('#btnCancelarNovaOcorrencia');
        if (btnCancelarNovaOcorrencia) abrirModalCancelamento(() => fecharFormulario('ocorrencias'));

        const btnCancelarNovaSolicitacao = event.target.closest('#btnCancelarNovaSolicitacao');
        if (btnCancelarNovaSolicitacao) abrirModalCancelamento(() => fecharFormulario('solicitacoes'));

        const btnExibirDetalhesFila = event.target.closest('[data-action="exibir-detalhes"]');
        if (btnExibirDetalhesFila) {
            const codigo = btnExibirDetalhesFila.closest('.queue-card')?.dataset.codigo || '';
            exibirFeedbackUnidades(`
                <div class="alert alert-info feedback-alert shadow-sm mb-0">
                    Item ${codigo} selecionado.
                </div>
            `);
        }

        const btnRetirar = event.target.closest('[data-action="retirar-trabalhador"]');
        if (btnRetirar) {
            const idColaborador = Number(btnRetirar.dataset.colaboradorId);
            if (state.unidadeSelecionada?.id_unidade && idColaborador) {
                await MestreDeObrasAPI.retirarTrabalhador(state.unidadeSelecionada.id_unidade, idColaborador);
                exibirSucessoTemporarioUnidades('Trabalhador retirado da equipe com sucesso.');
                await renderizarAbaEquipe();
            }
        }
    });

    document.addEventListener('submit', async (event) => {
        const formOcorrencia = event.target.closest('#novaOcorrenciaForm');
        if (formOcorrencia) {
            event.preventDefault();
            await salvarNovaOcorrencia(formOcorrencia);
        }

        const formSolicitacao = event.target.closest('#novaSolicitacaoForm');
        if (formSolicitacao) {
            event.preventDefault();
            await salvarNovaSolicitacao(formSolicitacao);
        }
    });

    const confirmarCancelamentoRegistro = document.getElementById('confirmarCancelamentoRegistro');
    if (confirmarCancelamentoRegistro) {
        confirmarCancelamentoRegistro.addEventListener('click', () => {
            if (window.__unidadesPendingCancelAction) {
                window.__unidadesPendingCancelAction();
                window.__unidadesPendingCancelAction = null;
            }

            const modalElement = document.getElementById('cancelarRegistroModal');
            if (modalElement) {
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) modal.hide();
            }
        });
    }
}

function mostrarGridUnidades() {
    const gridScreen = document.getElementById('unidadesGridScreen');
    const detailScreen = document.getElementById('unidadesDetailScreen');

    if (gridScreen) gridScreen.classList.remove('d-none');
    if (detailScreen) detailScreen.classList.add('d-none');

    limparFeedbackUnidades();
}

function mostrarDetalheUnidade() {
    const gridScreen = document.getElementById('unidadesGridScreen');
    const detailScreen = document.getElementById('unidadesDetailScreen');

    if (gridScreen) gridScreen.classList.add('d-none');
    if (detailScreen) detailScreen.classList.remove('d-none');
}

function ativarBotaoTab(tab) {
    const botoes = document.querySelectorAll('#detailTabsNav [data-tab]');
    botoes.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
    });
}

function abrirFormulario(tipo) {
    const tablePanel = document.getElementById(`${tipo}TablePanel`);
    const formPanel = document.getElementById(`${tipo}FormPanel`);

    if (tablePanel) tablePanel.classList.add('hidden');
    if (formPanel) formPanel.classList.add('active');

    limparFeedbackUnidades();
}

function fecharFormulario(tipo) {
    const tablePanel = document.getElementById(`${tipo}TablePanel`);
    const formPanel = document.getElementById(`${tipo}FormPanel`);
    const form = formPanel ? formPanel.querySelector('form') : null;

    if (form) form.reset();
    if (formPanel) formPanel.classList.remove('active');
    if (tablePanel) tablePanel.classList.remove('hidden');

    limparFeedbackUnidades();
}

function abrirModalCancelamento(onConfirm) {
    window.__unidadesPendingCancelAction = onConfirm;
    const modalElement = document.getElementById('cancelarRegistroModal');
    if (!modalElement) return;

    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.show();
}

function exibirFeedbackUnidades(html) {
    const feedbackArea = document.getElementById('unidadeFeedbackArea');
    if (!feedbackArea) return;
    feedbackArea.innerHTML = html;
}

function limparFeedbackUnidades() {
    const feedbackArea = document.getElementById('unidadeFeedbackArea');
    if (!feedbackArea) return;
    feedbackArea.innerHTML = '';
}

function exibirSucessoTemporarioUnidades(mensagem, tempo = 2000) {
    exibirFeedbackUnidades(`
        <div class="alert alert-success feedback-alert shadow-sm mb-0">
            ${mensagem}
        </div>
    `);

    window.setTimeout(() => {
        limparFeedbackUnidades();
    }, tempo);
}

/* ====================================================================================================
                                            RENDER
==================================================================================================== */

async function renderizarModuloUnidades() {
    await carregarCachesBase();
    await renderizarGridUnidades();
}

async function carregarCachesBase() {
    try {
        const [etapas, materiais, colaboradores] = await Promise.all([
            MestreDeObrasAPI.getEtapas(),
            MestreDeObrasAPI.getMateriaisDisponiveis(),
            MestreDeObrasAPI.getColaboradoresDisponiveis()
        ]);

        state.cache.etapas = etapas;
        state.cache.materiais = materiais;
        state.cache.colaboradores = colaboradores;
    } catch (error) {
        console.error('[carregarCachesBase]:', error.message);
    }
}

async function renderizarGridUnidades() {
    try {
        const resposta = await MestreDeObrasAPI.getUnidades(state.filtrosGrid);
        const grid = document.getElementById('unidadesGrid');
        if (!grid) return;

        preencherSelectFiltro('filterEtapaUnidade', resposta.filtros?.etapas || [], 'Todas');
        preencherSelectFiltro('filterStatusUnidade', resposta.filtros?.status || [], 'Todos');
        preencherSelectFiltro('filterLiderUnidade', resposta.filtros?.lideres || [], 'Todos');

        grid.innerHTML = '';

        if (!Array.isArray(resposta.unidades) || !resposta.unidades.length) {
            grid.appendChild(clonarTemplate('template-unidades-empty-state'));
            return;
        }

        resposta.unidades.forEach(unidade => {
            const card = clonarTemplate('template-unidade-card');
            const root = card.querySelector('[data-unit-id]');

            root.dataset.unitId = unidade.id_unidade;
            setText(card, '[data-field="numero-casa"]', unidade.local_unidade || '-');
            setText(card, '[data-field="rua-unidade"]', unidade.tipo || '-');
            setText(card, '[data-field="status-unidade"]', unidade.status || '-');
            setText(card, '[data-field="etapa-unidade"]', unidade.etapa || '-');
            setText(card, '[data-field="lider-unidade"]', unidade.lider || '-');
            setText(card, '[data-field="resumo-equipe-unidade"]', unidade.resumo_equipe || '-');
            setText(card, '[data-field="progresso-unidade"]', derivarProgressoPorEtapa(unidade.etapa));
            setText(card, '[data-field="ocorrencias-abertas"]', unidade.ocorrencias_abertas ?? 0);
            setText(card, '[data-field="solicitacoes-abertas"]', unidade.solicitacoes_abertas ?? 0);

            const progressBar = card.querySelector('[data-field="progresso-barra"]');
            if (progressBar) {
                progressBar.style.width = derivarProgressoPorEtapa(unidade.etapa);
            }

            grid.appendChild(card);
        });
    } catch (error) {
        console.error('[renderizarGridUnidades]:', error.message);
        exibirFeedbackUnidades(`
            <div class="alert alert-danger feedback-alert shadow-sm mb-0">
                Erro ao carregar as unidades.
            </div>
        `);
    }
}

async function abrirDetalheUnidade(idUnidade) {
    const detalhe = await MestreDeObrasAPI.getUnidadeDetalhe(idUnidade);
    state.unidadeSelecionada = detalhe;
    state.abaAtiva = 'visao-geral';

    atualizarTopBarDetalhe(detalhe);
    mostrarDetalheUnidade();
    ativarBotaoTab('visao-geral');
    await renderizarAba('visao-geral');
}

function atualizarTopBarDetalhe(unidade) {
    setText(document, '#detailCasaTitulo', unidade.local_unidade || 'Casa -');
    setText(document, '#detailCasaEtapa', `Etapa: ${unidade.etapa || '-'}`);
    setText(document, '#detailCasaLider', `Líder: ${unidade.lider || '-'}`);
}

async function renderizarAba(tab) {
    switch (tab) {
        case 'visao-geral':
            await renderizarAbaVisaoGeral();
            break;
        case 'ocorrencias':
            await renderizarAbaOcorrencias();
            break;
        case 'solicitacoes':
            await renderizarAbaSolicitacoes();
            break;
        case 'equipe':
            await renderizarAbaEquipe();
            break;
        default:
            await renderizarAbaVisaoGeral();
            break;
    }
}

async function renderizarAbaVisaoGeral() {
    const container = document.getElementById('detailBodyContent');
    const view = clonarTemplate('template-unidades-visao-geral');
    container.innerHTML = '';
    container.appendChild(view);

    const resposta = await MestreDeObrasAPI.getUnidadeVisaoGeral(state.unidadeSelecionada.id_unidade);
    const unidade = resposta.unidade;

    setText(container, '[data-field="unidade-casa"]', unidade.local_unidade || '-');
    setText(container, '[data-field="unidade-etapa"]', unidade.etapa || '-');
    setText(container, '[data-field="unidade-lider"]', unidade.lider || '-');
    setText(container, '[data-field="unidade-rua"]', unidade.tipo || '-');
    setText(container, '[data-field="unidade-data-inicio"]', '-');
    setText(container, '[data-field="unidade-status"]', unidade.status || '-');
    setText(container, '[data-field="unidade-resumo-equipe"]', unidade.resumo_equipe || '-');
    setText(container, '[data-field="unidade-avanco"]', derivarProgressoPorEtapa(unidade.etapa));

    const ocorrenciasWrap = document.getElementById('overviewOcorrenciasRecentes');
    const solicitacoesWrap = document.getElementById('overviewSolicitacoesRecentes');
    const historicoWrap = document.getElementById('overviewHistoricoRapido');

    renderizarQuickList(ocorrenciasWrap, resposta.ocorrenciasRecentes, 'Nenhuma ocorrência aberta no momento.');
    renderizarQuickList(solicitacoesWrap, resposta.solicitacoesRecentes, 'Nenhuma solicitação aberta no momento.');
    renderizarHistorico(historicoWrap, resposta.historicoRapido);
}

async function renderizarAbaOcorrencias() {
    const container = document.getElementById('detailBodyContent');
    const view = clonarTemplate('template-unidades-ocorrencias');
    container.innerHTML = '';
    container.appendChild(view);

    const rows = await MestreDeObrasAPI.getOcorrencias(state.unidadeSelecionada.id_unidade);
    const tbody = document.getElementById('ocorrenciasTableBody');
    const queue = document.getElementById('ocorrenciasQueueList');

    tbody.innerHTML = '';
    queue.innerHTML = '';

    if (!rows.length) {
        const empty = clonarTemplate('template-empty-list-state');
        setText(empty, '[data-field="empty-message"]', 'Nenhuma ocorrência encontrada.');
        tbody.innerHTML = `<tr><td colspan="5"></td></tr>`;
        tbody.querySelector('td').appendChild(empty);
        queue.appendChild(empty.cloneNode(true));
        return;
    }

    rows.forEach(item => {
        const row = clonarTemplate('template-ocorrencia-table-row');
        setText(row, '[data-field="ocorrencia-codigo"]', item.codigo);
        setText(row, '[data-field="ocorrencia-titulo"]', item.titulo);
        setStatusCell(row, '[data-field="ocorrencia-status-cell"]', item.status);
        setText(row, '[data-field="ocorrencia-data"]', item.data_formatada);
        setText(row, '[data-field="ocorrencia-descricao"]', item.descricao);
        tbody.appendChild(row);

        if (isStatusAberto(item.status)) {
            const queueCard = clonarTemplate('template-queue-card');
            queueCard.querySelector('.queue-card').dataset.codigo = item.codigo;
            setText(queueCard, '[data-field="queue-codigo"]', item.codigo);
            queue.appendChild(queueCard);
        }
    });
}

async function renderizarAbaSolicitacoes() {
    const container = document.getElementById('detailBodyContent');
    const view = clonarTemplate('template-unidades-solicitacoes');
    container.innerHTML = '';
    container.appendChild(view);

    popularSelectMateriaisNoFormulario();

    const rows = await MestreDeObrasAPI.getSolicitacoes(state.unidadeSelecionada.id_unidade);
    const tbody = document.getElementById('solicitacoesTableBody');
    const queue = document.getElementById('solicitacoesQueueList');

    tbody.innerHTML = '';
    queue.innerHTML = '';

    if (!rows.length) {
        const empty = clonarTemplate('template-empty-list-state');
        setText(empty, '[data-field="empty-message"]', 'Nenhuma solicitação encontrada.');
        tbody.innerHTML = `<tr><td colspan="5"></td></tr>`;
        tbody.querySelector('td').appendChild(empty);
        queue.appendChild(empty.cloneNode(true));
        return;
    }

    rows.forEach(item => {
        const row = clonarTemplate('template-solicitacao-table-row');
        setText(row, '[data-field="solicitacao-codigo"]', item.codigo);
        setText(row, '[data-field="solicitacao-titulo"]', item.titulo);
        setStatusCell(row, '[data-field="solicitacao-status-cell"]', item.status);
        setText(row, '[data-field="solicitacao-data"]', item.data_formatada);
        setText(row, '[data-field="solicitacao-descricao"]', item.descricao || '-');
        tbody.appendChild(row);

        if (isStatusAberto(item.status)) {
            const queueCard = clonarTemplate('template-queue-card');
            queueCard.querySelector('.queue-card').dataset.codigo = item.codigo;
            setText(queueCard, '[data-field="queue-codigo"]', item.codigo);
            queue.appendChild(queueCard);
        }
    });
}

async function renderizarAbaEquipe() {
    const container = document.getElementById('detailBodyContent');
    const view = clonarTemplate('template-unidades-equipe');
    container.innerHTML = '';
    container.appendChild(view);

    const rows = await MestreDeObrasAPI.getEquipe(state.unidadeSelecionada.id_unidade);
    const teamList = document.getElementById('teamList');

    popularSelectFuncoesEquipe(rows);

    const nomeInput = document.getElementById('teamNomeFilter');
    const funcaoSelect = document.getElementById('teamFuncaoFilter');
    const statusSelect = document.getElementById('teamStatusFilter');
    const btnAlocar = document.getElementById('btnAlocarTrabalhadores');

    const rerenderLista = async () => {
        const filtros = {
            nome: nomeInput?.value?.trim() || '',
            funcao: funcaoSelect?.value || '',
            status: statusSelect?.value || ''
        };

        const filteredRows = await MestreDeObrasAPI.getEquipe(state.unidadeSelecionada.id_unidade, filtros);
        teamList.innerHTML = '';

        if (!filteredRows.length) {
            const empty = clonarTemplate('template-empty-list-state');
            setText(empty, '[data-field="empty-message"]', 'Nenhum trabalhador da equipe atual corresponde aos filtros aplicados.');
            teamList.appendChild(empty);
            return;
        }

        filteredRows.forEach(item => {
            const card = clonarTemplate('template-team-member-card');
            setText(card, '[data-field="team-member-name"]', item.nome);
            setText(card, '[data-field="team-member-role"]', `${item.funcao || '-'} | ${item.status}`);
            const btn = card.querySelector('[data-action="retirar-trabalhador"]');
            if (btn) btn.dataset.colaboradorId = item.id_colaborador;
            teamList.appendChild(card);
        });
    };

    if (nomeInput) nomeInput.addEventListener('input', rerenderLista);
    if (funcaoSelect) funcaoSelect.addEventListener('change', rerenderLista);
    if (statusSelect) statusSelect.addEventListener('change', rerenderLista);

    if (btnAlocar) {
        btnAlocar.addEventListener('click', async () => {
            const primeiroDisponivel = state.cache.colaboradores[0];
            if (!primeiroDisponivel) {
                exibirFeedbackUnidades(`
                    <div class="alert alert-warning feedback-alert shadow-sm mb-0">
                        Nenhum colaborador disponível em cache para alocação.
                    </div>
                `);
                return;
            }

            try {
                await MestreDeObrasAPI.alocarTrabalhador(state.unidadeSelecionada.id_unidade, primeiroDisponivel.id_colaborador);
                exibirSucessoTemporarioUnidades('Trabalhador alocado com sucesso.');
                await rerenderLista();
            } catch (error) {
                exibirFeedbackUnidades(`
                    <div class="alert alert-danger feedback-alert shadow-sm mb-0">
                        ${error.message}
                    </div>
                `);
            }
        });
    }

    await rerenderLista();
}

async function salvarNovaOcorrencia(form) {
    const payload = {
        descricao: form.descricao?.value?.trim() || '',
        status: form.status?.value || 'ABERTA',
        data: form.data?.value || new Date().toISOString().slice(0, 10)
    };

    if (!payload.descricao) {
        exibirFeedbackUnidades(`
            <div class="alert alert-warning feedback-alert shadow-sm mb-0">
                Preencha a descrição da ocorrência.
            </div>
        `);
        return;
    }

    await MestreDeObrasAPI.criarOcorrencia(state.unidadeSelecionada.id_unidade, payload);
    fecharFormulario('ocorrencias');
    exibirSucessoTemporarioUnidades('Ocorrência registrada com sucesso.');
    await renderizarAbaOcorrencias();
}

async function salvarNovaSolicitacao(form) {
    const selectMaterial = form.querySelector('[name="id_armazem"]');
    const selectColaborador = form.querySelector('[name="id_colaborador"]');

    const payload = {
        id_armazem: Number(selectMaterial?.value),
        id_colaborador: Number(selectColaborador?.value),
        quantidade: Number(form.quantidade?.value),
        status: form.status?.value || 'PENDENTE',
        justificativa: form.descricao?.value?.trim() || ''
    };

    if (!payload.id_armazem || !payload.id_colaborador || !payload.quantidade) {
        exibirFeedbackUnidades(`
            <div class="alert alert-warning feedback-alert shadow-sm mb-0">
                Preencha material, colaborador e quantidade.
            </div>
        `);
        return;
    }

    await MestreDeObrasAPI.criarSolicitacao(state.unidadeSelecionada.id_unidade, payload);
    fecharFormulario('solicitacoes');
    exibirSucessoTemporarioUnidades('Solicitação realizada com sucesso.');
    await renderizarAbaSolicitacoes();
}

/* ====================================================================================================
                                            HELPERS DE TEMPLATE
==================================================================================================== */

function clonarTemplate(id) {
    const template = document.getElementById(id);
    if (!template) {
        throw new Error(`Template não encontrado: ${id}`);
    }
    return template.content.cloneNode(true);
}

function setText(scope, selector, value) {
    const node = scope.querySelector ? scope.querySelector(selector) : document.querySelector(selector);
    if (node) node.textContent = value ?? '-';
}

function setStatusCell(scope, selector, status) {
    const node = scope.querySelector(selector);
    if (!node) return;

    const statusText = String(status || '-');
    node.innerHTML = `<span class="badge status-badge ${statusClass(statusText)}">${statusText}</span>`;
}

function statusClass(status) {
    const value = String(status || '').toUpperCase();

    if (value.includes('ABERTA')) return 'status-aberta';
    if (value.includes('ANÁLISE') || value.includes('ANALISE') || value.includes('PENDENTE')) return 'status-analise';
    if (value.includes('RESOLVIDA') || value.includes('APROVADA') || value.includes('ENTREGUE') || value.includes('CONCLU')) return 'status-resolvida';
    if (value.includes('RECUSADA')) return 'status-recusada';

    return 'status-analise';
}

function isStatusAberto(status) {
    const value = String(status || '').toUpperCase();
    return ['ABERTA', 'EM ANÁLISE', 'EM ANALISE', 'PENDENTE'].includes(value);
}

function derivarProgressoPorEtapa(etapa) {
    const value = String(etapa || '').toLowerCase();

    if (value.includes('funda')) return '20%';
    if (value.includes('alven')) return '45%';
    if (value.includes('instala')) return '70%';
    if (value.includes('acab')) return '90%';
    if (value.includes('conclu')) return '100%';
    return '0%';
}

function preencherSelectFiltro(id, values, placeholder) {
    const select = document.getElementById(id);
    if (!select) return;

    const valorAtual = select.value;
    select.innerHTML = `<option value="">${placeholder}</option>`;

    values.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
    });

    select.value = valorAtual || '';
}

function popularSelectFuncoesEquipe(rows) {
    const select = document.getElementById('teamFuncaoFilter');
    if (!select) return;

    const funcoes = [...new Set(rows.map(item => item.funcao).filter(Boolean))];
    select.innerHTML = `<option value="">Todas</option>`;

    funcoes.forEach(funcao => {
        const option = document.createElement('option');
        option.value = funcao;
        option.textContent = funcao;
        select.appendChild(option);
    });
}

function popularSelectMateriaisNoFormulario() {
    const formPanel = document.getElementById('solicitacoesFormPanel');
    if (!formPanel) return;

    const form = formPanel.querySelector('form');
    if (!form) return;

    const row = form.querySelector('.row');
    if (!row) return;

    if (!form.querySelector('[name="id_armazem"]')) {
        row.insertAdjacentHTML('afterbegin', `
            <div class="col-12 col-md-6">
                <label class="form-label fw-semibold">Material</label>
                <select class="form-select" name="id_armazem"></select>
            </div>
            <div class="col-12 col-md-6">
                <label class="form-label fw-semibold">Solicitante</label>
                <select class="form-select" name="id_colaborador"></select>
            </div>
            <div class="col-12 col-md-3">
                <label class="form-label fw-semibold">Quantidade</label>
                <input type="number" class="form-control" name="quantidade" min="1">
            </div>
        `);
    }

    const materialSelect = form.querySelector('[name="id_armazem"]');
    const colaboradorSelect = form.querySelector('[name="id_colaborador"]');

    materialSelect.innerHTML = '<option value="">Selecione</option>';
    colaboradorSelect.innerHTML = '<option value="">Selecione</option>';

    state.cache.materiais.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id_armazem;
        option.textContent = `${item.nome} (${item.unidade_medida})`;
        materialSelect.appendChild(option);
    });

    state.cache.colaboradores.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id_colaborador;
        option.textContent = `${item.nome} - ${item.funcao || 'Sem função'}`;
        colaboradorSelect.appendChild(option);
    });
}

function renderizarQuickList(container, items, emptyMessage) {
    if (!container) return;
    container.innerHTML = '';

    if (!Array.isArray(items) || !items.length) {
        const empty = clonarTemplate('template-empty-list-state');
        setText(empty, '[data-field="empty-message"]', emptyMessage);
        container.appendChild(empty);
        return;
    }

    items.forEach(item => {
        const node = clonarTemplate('template-quick-list-item');
        setText(node, '[data-field="quick-item-codigo"]', item.codigo);
        setText(node, '[data-field="quick-item-status"]', item.status);
        setText(node, '[data-field="quick-item-titulo"]', item.titulo);
        setText(node, '[data-field="quick-item-data"]', item.data);
        container.appendChild(node);
    });
}

function renderizarHistorico(container, items) {
    if (!container) return;
    container.innerHTML = '';

    if (!Array.isArray(items) || !items.length) {
        const empty = clonarTemplate('template-empty-list-state');
        setText(empty, '[data-field="empty-message"]', 'Nenhum histórico recente encontrado.');
        container.appendChild(empty);
        return;
    }

    items.forEach(item => {
        const node = clonarTemplate('template-quick-history-item');
        setText(node, '[data-field="historico-texto"]', item.texto);
        setText(node, '[data-field="historico-data"]', formatarDataHora(item.data));
        container.appendChild(node);
    });
}

function formatarDataHora(value) {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleString('pt-BR');
}

/* ====================================================================================================
                                            API PÚBLICA
==================================================================================================== */

window.UnidadesUI = {
    mostrarGridUnidades,
    mostrarDetalheUnidade,
    ativarBotaoTab,
    abrirFormulario,
    fecharFormulario,
    exibirFeedbackUnidades,
    exibirSucessoTemporarioUnidades
};

window.UnidadesRender = {
    renderizarModuloUnidades,
    renderizarGridUnidades,
    renderizarAba,
    abrirDetalheUnidade
};