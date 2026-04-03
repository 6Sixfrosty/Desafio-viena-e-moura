/**
 * RENDERIZA O CARD NA GRID
 * Use esta função para ver a casa no "grid de casas"
 */
function renderizarGridTeste() {
    const grid = document.querySelector('.modern-grid');
    if (!grid) return console.error("Grid não encontrada!");

    grid.innerHTML = `
        <div class="modern-card" onclick="simularDadosEscalaveis()">
            <div class="modern-card-header">
                <h4 class="modern-card-title">Unidade 501 - Torre Norte</h4>
                <span class="modern-card-badge status-aprovada">Em Obra</span>
            </div>
            <p class="modern-card-subtitle">Canteiro Central - Viena & Moura</p>
            <div class="modern-card-stats">
                <span>Progresso</span>
                <span>45%</span>
            </div>
            <div class="modern-progress-bg">
                <div class="modern-progress-bar bg-primary" style="width: 45%"></div>
            </div>
        </div>
    `;
    navegarPara('grid');
    console.log("Card de teste renderizado na Grid!");
}

/**
 * SIMULAÇÃO DE DADOS COMPLETOS (DETALHES)
 * Chama a navegação e preenche os scrolls internos
 */
function simularDadosEscalaveis() {
    const data = {
        nome: "Unidade 501 - Torre Norte",
        localizacao: "Canteiro Central",
        faseAtual: "Instalações Hidráulicas",
        materiais: Array.from({length: 15}, (_, i) => ({
            nome: `Material Exemplo ${i + 1}`,
            categoria: "Construção",
            qtd: Math.floor(Math.random() * 100),
            unidade: "un"
        })),
        equipe: Array.from({length: 10}, (_, i) => ({
            nome: `Colaborador ${i + 1}`,
            funcao: "Oficial",
            departamento: "Produção",
            dataAlocado: "02/04/2026"
        })),
        ocorrencias: Array.from({length: 20}, (_, i) => ({
            tipo: i % 2 === 0 ? "Técnico" : "Material",
            data: "02/04 14:00",
            descricao: `Ocorrência nº ${i + 1}. Testando scroll lateral.`
        }))
    };

    // 1. Injetar Info Geral
    document.getElementById('unidade-id-display').innerText = "V&M-501";
    const containerGeral = document.getElementById('conteudo-detalhe-geral');
    if (containerGeral) {
        containerGeral.innerHTML = `
            <div class="p-4">
                <h3 class="fw-bold mb-1">${data.nome}</h3>
                <p class="text-muted mb-0"><i class="bi bi-geo-alt"></i> ${data.localizacao}</p>
                <hr>
                <div class="d-flex align-items-center">
                    <span class="badge bg-primary me-2">Fase: ${data.faseAtual}</span>
                    <span class="text-primary fw-bold">45% Concluído</span>
                </div>
            </div>
        `;
    }

    // 2. Materiais
    const listaMat = document.getElementById('lista-materiais');
    if (listaMat) {
        listaMat.innerHTML = data.materiais.map(m => `
            <div class="col-12 col-md-6">
                <div class="material-item-card d-flex justify-content-between align-items-center">
                    <div>
                        <div class="fw-bold small">${m.nome}</div>
                        <small class="text-muted">${m.categoria}</small>
                    </div>
                    <span class="badge bg-white text-primary border">${m.qtd} ${m.unidade}</span>
                </div>
            </div>
        `).join('');
    }

    // 3. Equipe
    const corpoTabela = document.getElementById('tabela-equipe-corpo');
    if (corpoTabela) {
        corpoTabela.innerHTML = data.equipe.map(c => `
            <tr>
                <td><span class="fw-bold small">${c.nome}</span></td>
                <td class="small">${c.funcao}</td>
                <td class="small"><span class="badge bg-light text-dark border">${c.departamento}</span></td>
                <td class="text-muted small">${c.dataAlocado}</td>
            </tr>
        `).join('');
    }

    // 4. Ocorrências
    const listaOcorr = document.getElementById('lista-ocorrencias');
    const badgeCount = document.getElementById('count-ocorrencias');
    if (badgeCount) badgeCount.innerText = data.ocorrencias.length;
    if (listaOcorr) {
        listaOcorr.innerHTML = data.ocorrencias.map(o => `
            <div class="p-3 mb-2 rounded border-start border-4 shadow-sm bg-white ${o.tipo === 'Material' ? 'border-danger' : 'border-warning'}">
                <div class="d-flex justify-content-between small fw-bold mb-1">
                    <span class="${o.tipo === 'Material' ? 'text-danger' : 'text-warning'}">${o.tipo.toUpperCase()}</span>
                    <span class="text-muted">${o.data}</span>
                </div>
                <div class="small">${o.descricao}</div>
            </div>
        `).join('');
    }

    // NAVEGAR
    navegarPara('detalhe');
}