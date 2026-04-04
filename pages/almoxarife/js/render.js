import { AlmoxarifeAPI } from '../../../core/api/almoxarife.js';

/* ====================================================================================================
                                            SQL & RENDER
==================================================================================================== */

// Função Central de Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log("Sistema Inicializado");

    // 1. Renderiza APENAS a página principal (ex: Armazém)
    renderizarArmazem();

    // 2. Configura a navegação (renderização sob demanda)
    configurarNavegacao();
});


function configurarNavegacao() {
    const navLinks = document.querySelectorAll('.menu-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');

            switch (page) {
                case 'armazem': renderizarArmazem(); break;
                case 'controle-estoque': renderizarEstoque(); break;
                case 'painel-pedidos': renderizarPedidos(); break;
                case 'relatorios': renderizarRelatorios(); break;
            }
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