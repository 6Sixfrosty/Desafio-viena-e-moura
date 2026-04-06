// ============================================================
// checklist.js - Sistema de Checklist de Obra
// ============================================================
// Funcionalidades implementadas:
// 1. Seleção de unidade/obra (Casa 01, 02, 03)
// 2. Dias fixos de 1 a 8
// 3. Tarefas por fase (Fundação, Alvenaria, Acabamento)
// 4. Responsável por tarefa (select)
// 5. Horário de início e fim
// 6. Botão de pendência com justificativa
// 7. Resumo do dia (observações gerais)
// 8. Persistência no localStorage
// 9. Indicador de sincronia
// 10. Relatório detalhado do dia
// ============================================================

// ============================================================
// 1. DADOS ESTÁTICOS (SIMULANDO BANCO DE DADOS)
// ============================================================

// Unidades/Obras disponíveis
const unidadesObra = [
    {
        id: 1,
        nome: "Casa 01",
        faseAtual: "Fundação",
        progresso: 15,
        dataInicio: "2026-01-10"
    },
    {
        id: 2,
        nome: "Casa 02",
        faseAtual: "Alvenaria",
        progresso: 45,
        dataInicio: "2026-02-15"
    },
    {
        id: 3,
        nome: "Casa 03",
        faseAtual: "Acabamento",
        progresso: 85,
        dataInicio: "2026-03-20"
    }
];

// Lista de responsáveis disponíveis (simula equipe)
const responsaveisDisponiveis = [
    "João (Pedreiro)",
    "Carlos (Servente)",
    "José (Armador)",
    "Marcos (Eletricista)",
    "Rafael (Encanador)",
    "André (Mestre)"
];

// Motivos de pendência pré-definidos
const motivosPendencia = [
    "Aguardando material",
    "Chuva/condições climáticas",
    "Falta de equipe",
    "Equipamento quebrado",
    "Replanejamento da obra",
    "Feriado/paralisação",
    "Outros"
];

// ============================================================
// 2. TAREFAS POR FASE DA OBRA
// ============================================================

const tarefasPorFase = {
    "Fundação": {
        titulo: "🔨 Etapa de Fundação",
        topicos: [
            {
                nome: "🛡️ Segurança do Trabalho",
                tarefas: [
                    "EPI's obrigatórios (capacete, luva, bota)",
                    "Botas de segurança",
                    "Uniforme padronizado",
                    "Cinto de segurança"
                ]
            },
            {
                nome: "📦 Materiais da Fundação",
                tarefas: [
                    "Concreto usinado (verificar volume e qualidade)",
                    "Ferragens (vergalhões CA-50 e CA-60)",
                    "Formas metálicas para sapata/cinta",
                    "Areia e brita para contra-fundo"
                ]
            },
            {
                nome: "🔧 Equipamentos",
                tarefas: [
                    "Betoneira em funcionamento (verificar manutenção)",
                    "Vibrador de concreto (testar funcionamento)",
                    "Compactador de solo (nível de óleo)",
                    "Carrinho de mão (3 unidades disponíveis)"
                ]
            },
            {
                nome: "✅ Ações do Dia",
                tarefas: [
                    "Escavação e nivelamento do terreno",
                    "Montagem das formas conforme projeto",
                    "Armação das ferragens (espaçamento correto)",
                    "Concretagem das sapatas",
                    "Limpeza e organização do canteiro"
                ]
            }
        ]
    },
    "Alvenaria": {
        titulo: "🧱 Etapa de Alvenaria",
        topicos: [
            {
                nome: "🛡️ Segurança do Trabalho",
                tarefas: [
                    "EPI's completos (capacete, luva, óculos, bota)",
                    "Andaimes nivelados e com trava de segurança",
                    "Proteção contra queda de materiais",
                    "Checklist de ferramentas elétricas"
                ]
            },
            {
                nome: "📦 Materiais da Alvenaria",
                tarefas: [
                    "Blocos cerâmicos (estoque suficiente para 3 dias)",
                    "Argamassa de assentamento (traço correto)",
                    "Vergalhões para cintas e vergas",
                    "Telas de aço para reforço estrutural"
                ]
            },
            {
                nome: "🔧 Equipamentos",
                tarefas: [
                    "Betoneira para argamassa (limpeza diária)",
                    "Carrinho de mão para transporte",
                    "Régua de alumínio para nivelamento",
                    "Serra mármore para corte de blocos"
                ]
            },
            {
                nome: "✅ Ações do Dia",
                tarefas: [
                    "Levantamento das paredes conforme projeto arquitetônico",
                    "Assentamento com argamassa e nível",
                    "Instalação de vergas e contravergas",
                    "Chapisco das paredes (preparação para reboco)",
                    "Limpeza diária do canteiro"
                ]
            }
        ]
    },
    "Acabamento": {
        titulo: "🎨 Etapa de Acabamento",
        topicos: [
            {
                nome: "🛡️ Segurança do Trabalho",
                tarefas: [
                    "EPI's específicos para pintura (máscara, luva, óculos)",
                    "Escadas e andaimes seguros (verificação diária)",
                    "Ventilação em ambientes fechados",
                    "Sinalização de áreas molhadas"
                ]
            },
            {
                nome: "📦 Materiais de Acabamento",
                tarefas: [
                    "Massa corrida e gesso (quantidade suficiente)",
                    "Tinta acrílica (cores definidas no projeto)",
                    "Revestimentos cerâmicos (pisos e paredes)",
                    "Argamassa ACIII para assentamento"
                ]
            },
            {
                nome: "🔧 Equipamentos",
                tarefas: [
                    "Lixadeira para paredes (discos novos)",
                    "Desempenadeira e régua de alumínio",
                    "Serra de corte para revestimento",
                    "Compressor de ar (se aplicável)"
                ]
            },
            {
                nome: "✅ Ações do Dia",
                tarefas: [
                    "Regularização de paredes (emboço/reboco)",
                    "Aplicação de massa corrida (2 demãos)",
                    "Lixamento e acabamento fino",
                    "Pintura de tetos e paredes",
                    "Limpeza final após pintura"
                ]
            }
        ]
    }
};

// ============================================================
// 3. VARIÁVEIS GLOBAIS
// ============================================================

let currentUnidadeCheck = 1;      // ID da unidade selecionada
let currentDia = 1;               // Dia atual (1 a 8)
let checklistsData = {};          // Armazena todos os checklists por unidade/dia
let pendingTask = null;           // Armazena a tarefa pendente temporariamente

// ============================================================
// 4. FUNÇÕES DE INICIALIZAÇÃO E CARREGAMENTO
// ============================================================

/**
 * Carrega os dados da unidade selecionada e atualiza os cards de resumo
 * @returns {Object} Dados da unidade atual
 */
function carregarDadosUnidade() {
    const unidade = unidadesObra.find(u => u.id === currentUnidadeCheck);
    if (!unidade) return null;

    const faseLabel = document.getElementById("faseAtualLabel");
    const progressoLabel = document.getElementById("progressoUnidadeLabel");
    const progressoBar = document.getElementById("progressoUnidadeBar");

    if (faseLabel) faseLabel.innerText = unidade.faseAtual;
    if (progressoLabel) progressoLabel.innerText = `${unidade.progresso}%`;
    if (progressoBar) progressoBar.style.width = `${unidade.progresso}%`;

    return unidade;
}

/**
 * Carrega dados salvos do localStorage
 * Mantém os checklists entre sessões do navegador
 */
function carregarDadosSalvos() {
    const salvos = localStorage.getItem('checklistsDataCompleto');
    if (salvos) {
        checklistsData = JSON.parse(salvos);
        atualizarIndicadorSincronia(true);
    }

    const ultimaUnidade = localStorage.getItem('lastUnidade');
    const ultimoDia = localStorage.getItem('lastDia');
    if (ultimaUnidade) currentUnidadeCheck = parseInt(ultimaUnidade);
    if (ultimoDia) currentDia = parseInt(ultimoDia);
}

/**
 * Salva os dados atuais no localStorage
 * @param {boolean} showFeedback - Se deve mostrar feedback visual
 */
function salvarDadosLocal(showFeedback = true) {
    localStorage.setItem('checklistsDataCompleto', JSON.stringify(checklistsData));
    localStorage.setItem('lastUnidade', currentUnidadeCheck);
    localStorage.setItem('lastDia', currentDia);

    if (showFeedback) {
        atualizarIndicadorSincronia(true);
        setTimeout(() => {
            const syncBadge = document.getElementById('statusSync');
            if (syncBadge) {
                syncBadge.innerHTML = '<i class="bi bi-cloud-check"></i> Sincronizado';
                syncBadge.className = 'badge bg-success';
            }
        }, 500);
    }
}

/**
 * Atualiza o indicador de sincronia na interface
 * @param {boolean} sincronizado - Estado da sincronia
 */
function atualizarIndicadorSincronia(sincronizado) {
    const syncBadge = document.getElementById('statusSync');
    if (!syncBadge) return;

    if (sincronizado) {
        syncBadge.innerHTML = '<i class="bi bi-cloud-check"></i> Sincronizado';
        syncBadge.className = 'badge bg-success';
    } else {
        syncBadge.innerHTML = '<i class="bi bi-cloud-slash"></i> Salvando...';
        syncBadge.className = 'badge bg-secondary';
    }
}

// ============================================================
// 5. FUNÇÕES DOS BOTÕES DE DIAS
// ============================================================

/**
 * Cria os botões de dias (fixos de 1 a 8)
 * Cada botão permite navegar entre os dias do checklist
 */
function criarBotoesDias() {
    const container = document.getElementById("diasBotoes");
    if (!container) {
        console.error("Elemento 'diasBotoes' não encontrado!");
        return;
    }

    container.innerHTML = '';

    for (let i = 1; i <= 8; i++) {
        const btn = document.createElement('button');
        btn.innerText = `Dia ${i}`;
        btn.className = `btn btn-outline-secondary rounded-pill me-2 mb-2 ${currentDia === i ? 'btn-primary-custom text-white' : ''}`;

        btn.onclick = () => {
            currentDia = i;
            document.querySelectorAll('#diasBotoes button').forEach(b => {
                b.classList.remove('btn-primary-custom', 'text-white');
            });
            btn.classList.add('btn-primary-custom', 'text-white');

            const diaLabel = document.getElementById("diaObraLabel");
            if (diaLabel) diaLabel.innerHTML = `Dia ${i}`;

            renderChecklistForm();
        };
        container.appendChild(btn);
    }

    console.log(`✅ ${container.children.length} botões de dias criados`);
}

// ============================================================
// 6. FUNÇÃO PRINCIPAL DE RENDERIZAÇÃO DO CHECKLIST
// ============================================================

/**
 * Renderiza o formulário completo do checklist para o dia/unidade atual
 * Gera todos os tópicos, tarefas e campos interativos
 */
function renderChecklistForm() {
    const container = document.getElementById("checklistFormContainer");
    if (!container) {
        console.error("Elemento 'checklistFormContainer' não encontrado!");
        return;
    }

    const unidade = unidadesObra.find(u => u.id === currentUnidadeCheck);
    if (!unidade) {
        container.innerHTML = '<div class="alert alert-danger">Unidade não encontrada!</div>';
        return;
    }

    const dadosFase = tarefasPorFase[unidade.faseAtual];
    if (!dadosFase) {
        container.innerHTML = '<div class="alert alert-warning">Nenhuma tarefa definida para esta fase</div>';
        return;
    }

    // Chave única para identificar este checklist específico
    const key = `${currentUnidadeCheck}_dia${currentDia}`;

    // Inicializa estrutura de dados se não existir
    if (!checklistsData[key]) {
        checklistsData[key] = {};
        dadosFase.topicos.forEach((topico, tIdx) => {
            topico.tarefas.forEach((_, taskIdx) => {
                checklistsData[key][`${tIdx}_${taskIdx}`] = {
                    concluido: false,      // Checkbox marcado?
                    obs: "",               // Observação da tarefa
                    responsavel: "",       // Quem executou
                    horarioInicio: "",     // Hora de início
                    horarioFim: "",        // Hora de término
                    pendencia: false,      // Está pendente?
                    pendenciaMotivo: "",   // Motivo da pendência
                    pendenciaObs: ""       // Observação da pendência
                };
            });
        });
    }

    // Início da construção do HTML
    let html = `<div class="alert alert-info mb-3">
                    📅 <strong>Dia ${currentDia}</strong> - ${dadosFase.titulo}
                    <small class="d-block text-muted mt-1">
                        Preencha todas as informações abaixo. Tarefas pendentes podem ser justificadas.
                    </small>
                </div>`;

    // Percorre todos os tópicos (Segurança, Materiais, Equipamentos, Ações)
    dadosFase.topicos.forEach((topico, tIdx) => {
        html += `<div class="topic-card mb-3 p-3" style="border-left: 4px solid #f97316; background: white; border-radius: 12px;">
                    <h5 class="mb-3">${topico.nome}</h5>`;

        // Percorre todas as tarefas do tópico atual
        topico.tarefas.forEach((tarefa, taskIdx) => {
            const state = checklistsData[key][`${tIdx}_${taskIdx}`];
            const pendenciaClass = state.pendencia ? 'tarefa-pendente' : '';

            html += `<div class="mb-3 pb-2 border-bottom ${pendenciaClass}" id="tarefa_${tIdx}_${taskIdx}">
                        <div class="d-flex flex-wrap align-items-center gap-2">

                            <!-- CHECKBOX DE CONCLUSÃO -->
                            <div class="form-check">
                                <input class="form-check-input task-check" type="checkbox"
                                       data-topico="${tIdx}" data-task="${taskIdx}"
                                       ${state.concluido ? 'checked' : ''}
                                       ${state.pendencia ? 'disabled' : ''}>
                                <label class="form-check-label fw-semibold">${tarefa}</label>
                            </div>

                            <!-- SELECT DE RESPONSÁVEL -->
                            <select class="form-select form-select-sm responsavel-select"
                                    style="width: 140px;"
                                    data-topico="${tIdx}" data-task="${taskIdx}">
                                <option value="">Responsável</option>
                                ${responsaveisDisponiveis.map(r =>
                                    `<option value="${r}" ${state.responsavel === r ? 'selected' : ''}>${r}</option>`
                                ).join('')}
                            </select>

                            <!-- HORÁRIO DE INÍCIO -->
                            <input type="time" class="form-control form-control-sm horario-inicio"
                                   style="width: 85px;"
                                   data-topico="${tIdx}" data-task="${taskIdx}"
                                   value="${state.horarioInicio || ''}"
                                   placeholder="Início">

                            <span class="text-muted">às</span>

                            <!-- HORÁRIO DE TÉRMINO -->
                            <input type="time" class="form-control form-control-sm horario-fim"
                                   style="width: 85px;"
                                   data-topico="${tIdx}" data-task="${taskIdx}"
                                   value="${state.horarioFim || ''}"
                                   placeholder="Fim">

                            <!-- BOTÃO DE OBSERVAÇÃO -->
                            <button class="btn btn-sm btn-outline-secondary btn-obs"
                                    data-topico="${tIdx}" data-task="${taskIdx}">
                                <i class="bi bi-chat-text"></i> Obs
                            </button>

                            <!-- BOTÃO DE PENDÊNCIA -->
                            <button class="btn btn-sm ${state.pendencia ? 'btn-warning' : 'btn-outline-warning'} btn-pendencia"
                                    data-topico="${tIdx}" data-task="${taskIdx}"
                                    data-tarefa-nome="${tarefa}">
                                <i class="bi bi-flag"></i>
                                ${state.pendencia ? 'Pendente' : 'Pendência'}
                            </button>
                        </div>

                        <!-- ÁREA DE OBSERVAÇÃO (expansível) -->
                        <div class="obs-area mt-2" id="obsArea_${tIdx}_${taskIdx}" style="display: ${state.obs ? 'block' : 'none'}">
                            <textarea class="form-control form-control-sm obs-textarea"
                                      data-topico="${tIdx}" data-task="${taskIdx}"
                                      rows="2" placeholder="Observações sobre esta tarefa...">${escapeHtml(state.obs)}</textarea>
                        </div>

                        <!-- ÁREA DE INFORMAÇÃO DA PENDÊNCIA -->
                        ${state.pendencia ? `
                        <div class="mt-2 small text-warning bg-light p-2 rounded" id="pendenciaInfo_${tIdx}_${taskIdx}">
                            <i class="bi bi-info-circle"></i>
                            <strong>Motivo:</strong> ${escapeHtml(state.pendenciaMotivo) || 'Não informado'}
                            ${state.pendenciaObs ? `<br><strong>Obs:</strong> ${escapeHtml(state.pendenciaObs)}` : ''}
                        </div>
                        ` : ''}

                     </div>`;
        });
        html += `</div>`;
    });

    // Adiciona o campo de resumo do dia (observações gerais)
    const resumoKey = `resumo_${currentUnidadeCheck}_dia${currentDia}`;
    const resumoAtual = checklistsData[resumoKey] || '';

    html += `<div class="card card-dashboard p-3 mt-3">
                <h6><i class="bi bi-chat-text"></i> Resumo do Dia</h6>
                <textarea id="resumoDiaTextarea" class="form-control" rows="3"
                          placeholder="Registre aqui imprevistos, materiais faltando, intercorrências, observações gerais do dia...">${escapeHtml(resumoAtual)}</textarea>
             </div>`;

    // Insere o HTML no container
    container.innerHTML = html;

    // ============================================================
    // 7. EVENTOS DOS COMPONENTES DINÂMICOS
    // ============================================================

    // Evento: Checkbox de conclusão
    document.querySelectorAll('.task-check').forEach(cb => {
        cb.addEventListener('change', function() {
            const tIdx = parseInt(this.dataset.topico);
            const taskIdx = parseInt(this.dataset.task);
            const key = `${currentUnidadeCheck}_dia${currentDia}`;

            if (checklistsData[key][`${tIdx}_${taskIdx}`]) {
                checklistsData[key][`${tIdx}_${taskIdx}`].concluido = this.checked;
                updateProgresso();
                salvarDadosLocal(false);
                atualizarIndicadorSincronia(false);
            }
        });
    });

    // Evento: Select de responsável
    document.querySelectorAll('.responsavel-select').forEach(select => {
        select.addEventListener('change', function() {
            const tIdx = parseInt(this.dataset.topico);
            const taskIdx = parseInt(this.dataset.task);
            const key = `${currentUnidadeCheck}_dia${currentDia}`;

            if (checklistsData[key][`${tIdx}_${taskIdx}`]) {
                checklistsData[key][`${tIdx}_${taskIdx}`].responsavel = this.value;
                salvarDadosLocal(false);
                atualizarIndicadorSincronia(false);
            }
        });
    });

    // Evento: Horário de início
    document.querySelectorAll('.horario-inicio').forEach(input => {
        input.addEventListener('change', function() {
            const tIdx = parseInt(this.dataset.topico);
            const taskIdx = parseInt(this.dataset.task);
            const key = `${currentUnidadeCheck}_dia${currentDia}`;

            if (checklistsData[key][`${tIdx}_${taskIdx}`]) {
                checklistsData[key][`${tIdx}_${taskIdx}`].horarioInicio = this.value;
                salvarDadosLocal(false);
                atualizarIndicadorSincronia(false);
            }
        });
    });

    // Evento: Horário de fim
    document.querySelectorAll('.horario-fim').forEach(input => {
        input.addEventListener('change', function() {
            const tIdx = parseInt(this.dataset.topico);
            const taskIdx = parseInt(this.dataset.task);
            const key = `${currentUnidadeCheck}_dia${currentDia}`;

            if (checklistsData[key][`${tIdx}_${taskIdx}`]) {
                checklistsData[key][`${tIdx}_${taskIdx}`].horarioFim = this.value;
                salvarDadosLocal(false);
                atualizarIndicadorSincronia(false);
            }
        });
    });

    // Evento: Botão de observação (expande textarea)
    document.querySelectorAll('.btn-obs').forEach(btn => {
        btn.addEventListener('click', function() {
            const tIdx = this.dataset.topico;
            const taskIdx = this.dataset.task;
            const area = document.getElementById(`obsArea_${tIdx}_${taskIdx}`);
            if (area) {
                area.style.display = area.style.display === 'none' ? 'block' : 'none';
            }
        });
    });

    // Evento: Textarea de observação (salva ao perder foco)
    document.querySelectorAll('.obs-textarea').forEach(ta => {
        ta.addEventListener('blur', function() {
            const tIdx = parseInt(this.dataset.topico);
            const taskIdx = parseInt(this.dataset.task);
            const key = `${currentUnidadeCheck}_dia${currentDia}`;

            if (checklistsData[key][`${tIdx}_${taskIdx}`]) {
                checklistsData[key][`${tIdx}_${taskIdx}`].obs = this.value;
                salvarDadosLocal(false);
                atualizarIndicadorSincronia(false);
            }
        });
    });

    // Evento: Botão de pendência (abre modal)
    document.querySelectorAll('.btn-pendencia').forEach(btn => {
        btn.addEventListener('click', function() {
            const tIdx = parseInt(this.dataset.topico);
            const taskIdx = parseInt(this.dataset.task);
            const tarefaNome = this.dataset.tarefaNome;
            const key = `${currentUnidadeCheck}_dia${currentDia}`;
            const estadoAtual = checklistsData[key][`${tIdx}_${taskIdx}`];

            // Armazena a tarefa pendente para referência no modal
            pendingTask = { tIdx, taskIdx, key, tarefaNome, estadoAtual };

            // Preenche o modal com os dados atuais
            const tarefaNomeSpan = document.getElementById("pendenciaTarefaNome");
            const selectMotivo = document.getElementById("pendenciaMotivo");
            const textareaObs = document.getElementById("pendenciaObs");

            if (tarefaNomeSpan) tarefaNomeSpan.innerText = tarefaNome;

            if (selectMotivo) {
                selectMotivo.innerHTML = motivosPendencia.map(m =>
                    `<option value="${m}" ${estadoAtual.pendenciaMotivo === m ? 'selected' : ''}>${m}</option>`
                ).join('');
            }

            if (textareaObs) textareaObs.value = estadoAtual.pendenciaObs || "";

            // Abre o modal
            const modal = new bootstrap.Modal(document.getElementById('pendenciaModal'));
            modal.show();
        });
    });

    // Evento: Resumo do dia (observações gerais)
    const resumoTextarea = document.getElementById("resumoDiaTextarea");
    if (resumoTextarea) {
        resumoTextarea.addEventListener('blur', function() {
            const resumoKey = `resumo_${currentUnidadeCheck}_dia${currentDia}`;
            checklistsData[resumoKey] = this.value;
            salvarDadosLocal(false);
            atualizarIndicadorSincronia(false);
        });
    }

    // Atualiza a barra de progresso
    updateProgresso();
    console.log(`✅ Checklist renderizado para ${unidade.nome}, Dia ${currentDia}`);
}

// ============================================================
// 8. FUNÇÕES DE PROGRESSO
// ============================================================

/**
 * Atualiza a barra de progresso do checklist do dia
 * Calcula quantas tarefas foram concluídas vs total
 */
function updateProgresso() {
    const unidade = unidadesObra.find(u => u.id === currentUnidadeCheck);
    if (!unidade) return;

    const dadosFase = tarefasPorFase[unidade.faseAtual];
    if (!dadosFase) return;

    const key = `${currentUnidadeCheck}_dia${currentDia}`;
    let total = 0, concluidas = 0;

    dadosFase.topicos.forEach((topico, tIdx) => {
        topico.tarefas.forEach((_, taskIdx) => {
            total++;
            if (checklistsData[key] && checklistsData[key][`${tIdx}_${taskIdx}`]?.concluido) {
                concluidas++;
            }
        });
    });

    const percent = total === 0 ? 0 : Math.round((concluidas / total) * 100);
    const percentSpan = document.getElementById("progressoPercentualCheck");
    const progressBar = document.getElementById("progressBarCheck");

    if (percentSpan) percentSpan.innerText = percent + "%";
    if (progressBar) progressBar.style.width = percent + "%";
}

/**
 * Registra uma pendência para uma tarefa
 * @param {number} tIdx - Índice do tópico
 * @param {number} taskIdx - Índice da tarefa
 * @param {string} motivo - Motivo da pendência
 * @param {string} observacao - Observação adicional
 */
function registrarPendencia(tIdx, taskIdx, motivo, observacao) {
    const key = `${currentUnidadeCheck}_dia${currentDia}`;

    if (checklistsData[key][`${tIdx}_${taskIdx}`]) {
        checklistsData[key][`${tIdx}_${taskIdx}`].pendencia = true;
        checklistsData[key][`${tIdx}_${taskIdx}`].pendenciaMotivo = motivo;
        checklistsData[key][`${tIdx}_${taskIdx}`].pendenciaObs = observacao;
        checklistsData[key][`${tIdx}_${taskIdx}`].concluido = false;

        salvarDadosLocal(true);
        renderChecklistForm();
    }
}

// ============================================================
// 9. FUNÇÕES DE RELATÓRIO
// ============================================================

/**
 * Gera e envia o relatório do dia
 * Mostra um resumo detalhado de todas as tarefas
 */
function enviarRelatorio() {
    const unidade = unidadesObra.find(u => u.id === currentUnidadeCheck);
    const dadosFase = tarefasPorFase[unidade.faseAtual];
    const key = `${currentUnidadeCheck}_dia${currentDia}`;
    const resumoKey = `resumo_${currentUnidadeCheck}_dia${currentDia}`;
    const resumoGeral = checklistsData[resumoKey] || 'Nenhum resumo registrado';

    let totalTarefas = 0;
    let concluidas = 0;
    let pendentes = 0;
    let detalhesTarefas = [];

    if (dadosFase) {
        dadosFase.topicos.forEach((topico, tIdx) => {
            topico.tarefas.forEach((tarefa, taskIdx) => {
                totalTarefas++;
                const estado = checklistsData[key]?.[`${tIdx}_${taskIdx}`] || {};

                if (estado.concluido) concluidas++;
                if (estado.pendencia) pendentes++;

                detalhesTarefas.push({
                    topico: topico.nome,
                    tarefa: tarefa,
                    concluido: estado.concluido || false,
                    pendente: estado.pendencia || false,
                    responsavel: estado.responsavel || 'Não definido',
                    horarioInicio: estado.horarioInicio || '-',
                    horarioFim: estado.horarioFim || '-',
                    observacao: estado.obs || '-',
                    motivoPendencia: estado.pendenciaMotivo || '-'
                });
            });
        });
    }

    const percentual = totalTarefas === 0 ? 0 : Math.round((concluidas / totalTarefas) * 100);

    // Monta o relatório formatado
    let relatorio = `📋 RELATÓRIO DO DIA ${currentDia}\n`;
    relatorio += `🏗️ Unidade: ${unidade.nome} (${unidade.faseAtual})\n`;
    relatorio += `📅 Data: ${new Date().toLocaleDateString('pt-BR')}\n`;
    relatorio += `📊 Progresso: ${percentual}% (${concluidas}/${totalTarefas} tarefas concluídas)\n`;
    relatorio += `⚠️ Pendências: ${pendentes}\n`;
    relatorio += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    relatorio += `📝 DETALHES DAS TAREFAS:\n`;
    detalhesTarefas.forEach((t, i) => {
        const status = t.concluido ? '✅' : (t.pendente ? '⚠️' : '❌');
        relatorio += `${status} ${t.tarefa}\n`;
        relatorio += `   👤 Responsável: ${t.responsavel}\n`;
        relatorio += `   ⏰ Horário: ${t.horarioInicio} às ${t.horarioFim}\n`;
        if (t.pendente) {
            relatorio += `   📌 Motivo pendência: ${t.motivoPendencia}\n`;
        }
        if (t.observacao !== '-') {
            relatorio += `   💬 Obs: ${t.observacao}\n`;
        }
        relatorio += `\n`;
    });

    relatorio += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    relatorio += `📌 RESUMO GERAL DO DIA:\n${resumoGeral}\n`;

    alert(relatorio);
    console.log("Relatório gerado:", relatorio);
}

// ============================================================
// 10. FUNÇÕES AUXILIARES
// ============================================================

/**
 * Escapa caracteres especiais para evitar XSS
 * @param {string} str - String a ser escapada
 * @returns {string} String segura
 */
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ============================================================
// 11. INICIALIZAÇÃO E EVENTOS
// ============================================================

/**
 * Inicializa o sistema
 * Carrega dados, configura eventos e renderiza a tela
 */
function init() {
    console.log("🚀 Inicializando sistema de checklist...");

    carregarDadosSalvos();
    carregarDadosUnidade();
    criarBotoesDias();
    renderChecklistForm();

    // Evento de confirmação do modal de pendência
    const confirmarPendenciaBtn = document.getElementById("confirmarPendenciaBtn");
    if (confirmarPendenciaBtn) {
        confirmarPendenciaBtn.addEventListener("click", () => {
            if (pendingTask) {
                const motivo = document.getElementById("pendenciaMotivo").value;
                const observacao = document.getElementById("pendenciaObs").value;

                registrarPendencia(
                    pendingTask.tIdx,
                    pendingTask.taskIdx,
                    motivo,
                    observacao
                );

                const modal = bootstrap.Modal.getInstance(document.getElementById('pendenciaModal'));
                if (modal) modal.hide();

                pendingTask = null;
            }
        });
    }

    // Evento de seleção de unidade
    document.querySelectorAll("#unidadeSelectChecklist .dropdown-item").forEach(item => {
        item.addEventListener("click", () => {
            currentUnidadeCheck = parseInt(item.dataset.unidadeId);
            const label = document.getElementById("unidadeChecklistLabel");
            if (label) label.innerText = item.innerText.split(' - ')[0];
            carregarDadosUnidade();
            renderChecklistForm();
            salvarDadosLocal(false);
        });
    });

    // Evento do botão de enviar relatório
    const btnRelatorio = document.getElementById("btnEnviarRelatorio");
    if (btnRelatorio) {
        btnRelatorio.addEventListener("click", enviarRelatorio);
    }

    console.log("✅ Sistema inicializado com sucesso!");
}

// Inicia o sistema quando a página carregar
document.addEventListener('DOMContentLoaded', init);