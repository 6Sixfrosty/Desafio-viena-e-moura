import { AlmoxarifeAPI } from '../../core/api/almoxarife.js';

const btn_imprimirEstoque = document.getElementById('btn-imprimir-estoque');
async function ImprimirEstoque() {
    try {
        const dados = await AlmoxarifeAPI.getPressEstoque();
        console.log("Dados que chegaram no Front:", dados);
    } catch (error) {
        console.error('ERROR in ImprimirEstoque(): ', error);
    }
}

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
            // Lógica simples para mudar a cor do badge conforme o status
            let badgeColor = "bg-success-subtle text-success border-success";
            if (item.status === "Reposição Urgente") badgeColor = "bg-danger-subtle text-danger border-danger";
            if (item.status === "Estoque Baixo") badgeColor = "bg-warning-subtle text-warning border-warning";

            tabela.innerHTML += `
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
                <span class="badge ${badgeColor} border border-opacity-10 px-3">
                    ${item.icone + item.status}
                </span>
            </td>
            <td class="text-end pe-4">
                <button class="btn btn-sm btn-white border shadow-sm"><i class="bi bi-eye"></i></button>
            </td>
        </tr>`;
        });

    }
    catch (error) {
        console.error("Erro ao buscar dados do armazém:", error);
        const tabela = document.getElementById('tabelaArmazemBody');
        tabela.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Erro ao carregar dados do armazém.</td></tr>`;
    }
}
document.addEventListener('DOMContentLoaded', renderizarArmazem);

document.addEventListener('click', function(event) {
    if(event.target === btn_imprimirEstoque){
        ImprimirEstoque()
    }
})