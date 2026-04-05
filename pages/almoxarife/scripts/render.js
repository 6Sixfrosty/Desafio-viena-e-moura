import { AlmoxarifeAPI } from '../../../core/api/almoxarife.js';

/* ====================================================================================================
                                            SQL & RENDER
==================================================================================================== */

// Função Central de Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    console.log("Sistema Inicializado");

    // 1. Configura a navegação
    configurarNavegacao();

    // 2. Exibe apenas a página inicial e espera renderizar antes de carregar
    await trocarPagina('armazem');
});

function esperarProximoFrame() {
    return new Promise(resolve => requestAnimationFrame(resolve));
}

async function esperarRenderizacao() {
    await esperarProximoFrame();
    await esperarProximoFrame();
}

function ocultarTodasPaginas() {
    const paginas = ['armazem', 'controle-estoque', 'painel-pedidos', 'relatorios'];

    paginas.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.style.display = 'none';
        }
    });
}

function mostrarPagina(page) {
    ocultarTodasPaginas();

    const pagina = document.getElementById(page);
    if (pagina) {
        pagina.style.display = 'block';
    }
}

function marcarMenuAtivo(page) {
    const navLinks = document.querySelectorAll('.menu-link');

    navLinks.forEach(link => {
        const paginaLink = link.getAttribute('data-page');
        link.classList.toggle('active', paginaLink === page);
    });
}

async function trocarPagina(page) {
    mostrarPagina(page);
    marcarMenuAtivo(page);

    // Espera a tela ser renderizada antes de executar o render da página
    await esperarRenderizacao();

    switch (page) {
        case 'armazem':
            await renderizarArmazem();
            break;
        case 'controle-estoque':
            await renderizarEstoque();
            break;
        case 'painel-pedidos':
            await renderizarPedidos();
            break;
        case 'relatorios':
            await renderizarEstoque();
            break;
    }
}

function configurarNavegacao() {
    const navLinks = document.querySelectorAll('.menu-link');

    navLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            await trocarPagina(page);
        });
    });
}



/* ====================================================================================================
                                        CONTROLLERS
==================================================================================================== */

//função de cor

function BadgeColor(color) {
    if (color === "green") return "bg-success-subtle text-success border-success";
    if (color === "yellow") return "bg-warning-subtle text-warning border-warning";
    if (color === "red") return "bg-danger-subtle text-danger border-danger";
}


document.addEventListener('click', function (event) {

    const btnImprimir = event.target.closest('#btn-imprimir-estoque');
    if (btnImprimir) {
        console.log("Ação: Imprimir Estoque");
        ImprimirEstoque();
    }


    const btnPedido = event.target.closest('[id^="pedido-"]');
    if (btnPedido) {
        const idPedido = btnPedido.id.split('-')[1];
        console.log("Abrindo detalhes do pedido: " + idPedido);
        // Ex: abrirModalDetalhes(idPedido);
    }
});



/* ====================================================================================================
                                        RENDERS
==================================================================================================== */

async function renderizarPedidos() {

    try {
        const dados = await AlmoxarifeAPI.getPedidos();
        console.table(dados);
        const containerFilaPedidos = document.getElementById('containerFilaPedidos')
        containerFilaPedidos.innerHTML = '';

        const tabelaPedidosBody = document.getElementById('tabelaPedidosBody');
        tabelaPedidosBody.innerHTML = '';


        const gridHtmlIDs = ['total-pedidos', 'pedidos-pendentes', 'pedidos-aprovados', 'pedidos-recusados']
        const gridInner = [dados[0].total_pedidos, dados[0].total_pendentes, dados[0].total_aprovados, dados[0].total_recusados];
        for (let i = 0; i < gridHtmlIDs.length; i++) {
            const element = document.getElementById(gridHtmlIDs[i]);
            if (element) {
                element.textContent = gridInner[i];
            }
        }




        const ListaPedidosCount = document.getElementById('countPendentes');
        ListaPedidosCount.innerHTML = '';
        ListaPedidosCount.innerHTML =
            ` 
<span class="fw-bold text-dark fs-6">Pendentes:</span>
<span class="fw-bold text-dark fs-5">${dados[0].total_pendentes}</span>
        `

        dados.forEach(item => {
            containerFilaPedidos.innerHTML +=
                `
                <button type="button" id="${item.codigo}" class="btn w-full text-start p-3 rounded-3 border-2 transition-all shadow-sm"
                    style="background-color: #fff; border-color: #e2e8f0;" data-bs-toggle="modal" data-bs-target="#modalDetalhesPedido">

                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="fw-bold text-dark fs-6" id="nomeSolicitante-1033">${item.solicitante}</span>
                        <span class="badge bg-primary bg-opacity-10 text-primary border border-primary-subtle px-2 py-1"
                            id="categoria-1033" style="font-size: 0.65rem;">${item.etapa}</span>
                    </div>

                    <div class="mb-2">
                        <div class="text-muted small" style="font-size: 0.8rem;" id="material-1033">${item.material}</div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mt-2 border-top pt-2">
                        <div class="small text-secondary">
                            ${item.unidade}: <span class="fw-bold text-dark" id="qtd-1033">${item.quantidade_solicitada}</span>
                        </div>
                        <div class="small text-muted d-flex align-items-center gap-1" style="font-size: 0.7rem;">
                            <i class="bi bi-clock"></i>
                            <span id="dataHora-1033">${item.data_solicitacao}</span>
                        </div>
                    </div>

                </button>
            `;

            tabelaPedidosBody.innerHTML +=
                `
                <tr style="cursor: pointer;" data-bs-toggle="modal" data-bs-target="#modalDetalhesPedido">
                    <td class="ps-4"><span class="fw-bold text-dark">#COD-${item.codigo}</span></td>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="bg-primary bg-opacity-10 text-primary fw-bold rounded-circle d-flex justify-content-center align-items-center me-2"
                                style="width: 32px; height: 32px; font-size: 0.8rem;">
                                GM
                            </div>
                            <div>
                                <h6 class="m-0 fw-bold text-dark fs-7" style="font-size: 0.9rem;">${item.solicitante}</h6>
                                <small class="text-muted" style="font-size: 0.75rem;">${item.funcao}</small>
                            </div>
                        </div>
                    </td>
                    <td>${item.unidade}</td>
                    <td>${item.data_solicitacao}</td>
                    <td>
                        <span class="badge rounded-pill border px-3 py-2 ${BadgeColor(item.cor)}">${item.icone + item.status}</span>
                    </td>
                    <td class="text-end pe-4">
                        <button class="btn btn-sm btn-light text-primary" title="Analisar"><i
                                class="bi bi-box-arrow-in-up-right"></i></button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Erro ao buscar dados do armazém:", error);
        const containerFilaPedidos = document.getElementById('tabelaArmazemBody');
        containerFilaPedidos.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Erro ao carregar dados da Lida de pedidos.</td></tr>`;
    }
};


async function renderizarArmazem() {
    try {
        const dados = await AlmoxarifeAPI.getArmazem();


        const gridHtmlIDs = ['endpoint-total-materiais', 'endpoint-estoque-critico'];
        const gridInner = [dados[0].totalGeral, dados[0].totalAbaixoMinimo];

        for (let i = 0; i < gridHtmlIDs.length; i++) {
            const element = document.getElementById(gridHtmlIDs[i]);
            if (element) {
                element.textContent = gridInner[i];
            }
        }

        const tabela = document.getElementById('tabelaArmazemBody');
        tabela.innerHTML = '';
        dados.forEach(item => {
            tabela.innerHTML +=
                `
                <tr>
                    <td class="ps-4">
                        <div class="d-flex flex-column">
                            <code class="text-primary fw-bold mb-1" style="font-size: 0.75rem;">${item.codigo}</code>
                            <span class="fw-bold text-dark">${item.material}</span>
                        </div>
                    </td>
                    <td>${item.marca}</td>
                    <td class="text-center">
                        <span class="fs-5 fw-bold">${item.saldoAtual}</span> <small class="text-muted">${item.unidade || ''}</small>
                    </td>
                    <td class="text-center text-muted">
                        ${item.estoqueMinimo}
                    </td>
                    <td>
                        <span class="badge ${BadgeColor(item.cor)} border border-opacity-10 px-3">
                            ${item.icone + item.status}
                        </span>
                    </td>
                    <td class="text-end pe-4">
                        <button id="${item.codigo}" class="btn btn-sm btn-white border shadow-sm"><i class="bi bi-eye"></i></button>
                    </td>
                </tr>
                `;
        });

    }
    catch (error) {
        console.error("Erro ao buscar dados do armazém:", error);
        const tabela = document.getElementById('tabelaArmazemBody');
        tabela.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Erro ao carregar dados do armazém.</td></tr>`;
    }
}



async function renderizarEstoque(filtros = {}) {
    try {
        const dados = await AlmoxarifeAPI.getControleEstoque(filtros);
        const tbody = document.getElementById('tabelaMovimentacoesBody');

        if (!Array.isArray(dados) || dados.length === 0) {
            tbody.innerHTML =
                `<tr><td colspan="6" class="text-center text-muted py-4">Nenhuma movimentacao encontrada.</td></tr>`;
            return;
        }

        document.getElementById('kpiEntradas').textContent = dados[0].total_entradas ?? 0;
        document.getElementById('kpiSaidas').textContent = dados[0].total_saidas ?? 0;
        document.getElementById('kpiEstoque').textContent = dados[0].estoque_total ?? 0;
        document.getElementById('kpiPendentes').textContent = dados[0].total_pendentes ?? 0;

        document.getElementById('trendEntradas').textContent = '-';
        document.getElementById('trendSaidas').textContent = '-';
        document.getElementById('trendEstoque').textContent = '-';
        document.getElementById('trendPendentes').textContent = '-';

        const escapeHtml = (valor) => String(valor ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

        const linhas = dados.map((item) => {
            const tipoValor = String(item.tipo_movimentacao ?? item.tipo ?? '').toLowerCase();
            const tipoDetectado = tipoValor.includes('entrada')
                ? 'ENTRADA'
                : tipoValor.includes('saida') || tipoValor.includes('saída')
                    ? 'SAIDA'
                    : Number(item.saldo_novo) >= Number(item.saldo_anterior)
                        ? 'ENTRADA'
                        : 'SAIDA';

            const isEntrada = tipoDetectado === 'ENTRADA';
            const tipoClasse = isEntrada ? 'status-aprovada' : 'status-pendente';
            const tipoLabel = isEntrada ? 'ENTRADA' : 'SAÍDA';
            const origemIcone = isEntrada ? 'bi-truck' : 'bi-box-arrow-up-right';

            const dataMovimentacao = escapeHtml(item.data_movimentacao ?? item.data ?? '--/--/----');
            const material = escapeHtml(item.material ?? item.nome_material ?? item.nome ?? '-');
            const quantidade = escapeHtml(item.quantidade ?? item.qtd ?? 0);
            const unidade = escapeHtml(item.unidade ?? item.unidade_medida ?? '');
            const origemDestino = escapeHtml(
                item.origem_destino ??
                item.origemDestino ??
                item.origem ??
                item.destino ??
                item.alteracao ??
                '-'
            );
            const status = escapeHtml(item.status ?? 'Concluído');

            return `
                <tr>
                    <td class="px-4 text-muted">${dataMovimentacao}</td>
                    <td class="text-dark fw-bold">${material}</td>
                    <td class="text-center">${quantidade} ${unidade}</td>
                    <td>
                        <span
                            class="badge status-badge ${tipoClasse} bg-opacity-10 rounded-pill">${tipoLabel}</span>
                    </td>
                    <td class="text-secondary">
                        <i class="bi ${origemIcone} me-2 text-muted"></i>${origemDestino}
                    </td>
                    <td class="px-4">
                        <span class="badge rounded-pill status-entregue">${status}</span>
                    </td>
                </tr>
            `;
        }).join('');

        tbody.innerHTML = linhas;

        const btnAplicarFiltros = document.getElementById('btnAplicarFiltros');
        if (btnAplicarFiltros) {
            btnAplicarFiltros.onclick = () => {
                const filtros = {
                    dataInicio: document.getElementById('filtroDataInicio').value,
                    dataFim: document.getElementById('filtroDataFim').value,
                    tipo: document.getElementById('filtroTipo').value
                };
                renderizarEstoque(filtros);
            };
        }

    } catch (error) {
        console.error('[renderizarEstoque]:', error.message);
        document.getElementById('tabelaMovimentacoesBody').innerHTML =
            `<tr><td colspan="6" class="text-center text-danger">Erro ao carregar movimentacoes.</td></tr>`;
    }
}

/* ====================================================================================================
                                        MODALS
==================================================================================================== */



/* ====================================================================================================
                                        FEATURES
==================================================================================================== */
async function ImprimirEstoque() {
    try {
        const dados = await AlmoxarifeAPI.getPressEstoque();
        console.log("Dados de impressão", dados)
    } catch (error) {
        console.error('Erro no teste:', error);
    }
}