document.addEventListener("DOMContentLoaded", () => {

    // --- 1. MOTOR DE NAVEGAÇÃO ---
    // Gerencia o display entre as seções
    window.navegarPara = function(destino) {
        const telas = {
            'grid': document.getElementById('tela-grid-casas'),
            'detalhe': document.getElementById('tela-detalhe-unidade'),
            'checklist': document.getElementById('tela-checklist')
        };

        // Esconde todas as telas
        Object.values(telas).forEach(t => {
            if (t) t.classList.add('d-none');
        });

        // Mostra a tela de destino
        const telaAlvo = telas[destino];
        if (telaAlvo) {
            telaAlvo.classList.remove('d-none');
            // Opcional: Adiciona animação se você tiver o animate.css
            telaAlvo.classList.add('animate__animated', 'animate__fadeIn');
        }
    };

    // --- 2. SELEÇÃO DE UNIDADE ---
    // Função chamada quando clicar em um card que já existe no seu HTML
    window.selecionarUnidade = function(id) {
        console.log("Unidade selecionada:", id);
        // Aqui você faria apenas a lógica de navegação para a tela de detalhes
        navegarPara('detalhe');
    };

    // --- 3. FUNCIONALIDADE DE PESQUISA ---
    // Filtra os cards que já estão na tela
    function configurarPesquisa() {
        const inputBusca = document.getElementById("inputBuscaCasas");
        if (!inputBusca) return;

        inputBusca.addEventListener("input", (e) => {
            const termo = e.target.value.toLowerCase();
            // Pega todos os cards que estão dentro da grid
            const cards = document.querySelectorAll(".modern-card");

            cards.forEach(card => {
                // Ele busca dentro do texto de cada card
                const textoDoCard = card.innerText.toLowerCase();
                
                if (textoDoCard.includes(termo)) {
                    card.style.display = ""; // Mostra (usa o padrão do CSS)
                } else {
                    card.style.display = "none"; // Esconde
                }
            });
        });
    }

    // Inicializa a busca
    configurarPesquisa();
});

