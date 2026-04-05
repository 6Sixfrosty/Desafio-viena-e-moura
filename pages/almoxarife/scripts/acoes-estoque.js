import { AlmoxarifeAPI } from '../../../core/api/almoxarife.js';

const containerEmail = document.getElementById('containerEmailExport');
const btnConfirmar = document.getElementById('btnConfirmarExport');
const modalElement = document.getElementById('modalExportar');

const modalExport = new bootstrap.Modal(modalElement);

document.getElementsByName('exportType').forEach(input => {
    input.addEventListener('change', (e) => {
        if (e.target.value === 'email') {
            containerEmail.classList.remove('d-none');
            document.getElementById('emailDestino').focus();
        } else {
            containerEmail.classList.add('d-none');
        }
    });
});

btnConfirmar.addEventListener('click', () => {
    const tipoExportacao = document.querySelector('input[name="exportType"]:checked').value;

    if (tipoExportacao === 'download') {
        baixarPDF();
        fecharModal();
    } else {
        const email = document.getElementById('emailDestino').value;
        if (!email || !email.includes('@')) {
            alert('Por favor, insira um e-mail válido.');
            return;
        }
        enviarPorEmail(email, btnConfirmar);
    }
});

function fecharModal() {
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
        modalInstance.hide();
    }
}

function gerarDocumentoPDF() {
    if (!window.jspdf) {
        console.error("Erro: jsPDF não carregado.");
        alert("Erro técnico: Biblioteca de PDF não encontrada.");
        return null;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt', 'a4');
    const tabelaHTML = document.querySelector('.custom-table');

    if (!tabelaHTML) {
        alert("Não há dados na tabela para exportar.");
        return null;
    }

    const titulo = "Relatório de Movimentação de Materiais - Construtec";
    const dataGeracao = `Gerado em: ${new Date().toLocaleString()}`;

    doc.setFontSize(18);
    doc.text(titulo, 40, 40);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(dataGeracao, 40, 60);

    doc.autoTable({
        html: '.custom-table',
        startY: 80,
        theme: 'striped',
        headStyles: { fillColor: [30, 41, 59] },
        styles: { fontSize: 8, cellPadding: 5 },
        didParseCell: function (data) {
            if (data.section === 'body' && data.column.index === 3) {
                const txt = data.cell.text[0] ? data.cell.text[0].toUpperCase() : "";
                if (txt.includes('ENTRADA')) data.cell.styles.textColor = [21, 128, 61];
                if (txt.includes('SAÍDA')) data.cell.styles.textColor = [185, 28, 28];
            }
        }
    });

    return doc;
}

/**
 * Ação 1: Baixar direto no computador
 */
function baixarPDF() {
    const doc = gerarDocumentoPDF();
    if (doc) {
        doc.save(`Relatorio_Estoque_${Date.now()}.pdf`);
        console.log("PDF baixado com sucesso!");
    }
}

/**
 * Ação 2: Enviar para o Back-end disparar por e-mail
 */
async function enviarPorEmail(emailDestino, btnElement) {
    const doc = gerarDocumentoPDF();
    if (!doc) return;

    // Feedback visual (Spinner no botão)
    const textoOriginal = btnElement.innerHTML;
    btnElement.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Enviando...';
    btnElement.disabled = true;

    // Transforma o PDF em Base64
    const pdfBase64 = doc.output('datauristring');

    try {
        // Chama a sua API passando o objeto que vai ser transformado em JSON pelo seu 'request'
        const resposta = await AlmoxarifeAPI.postPdfEmail({
            email: emailDestino,
            assunto: 'Relatório de Estoque - Construtec',
            arquivoPdf: pdfBase64
        });

        // Se chegou até aqui, o "res.ok" no seu request deu certo!
        alert(`Sucesso! O relatório foi enviado para ${emailDestino}`);
        bootstrap.Modal.getInstance(document.getElementById('modalExportar')).hide();
        // O erro já foi "printado" no console pelo seu 'request', aqui só avisamos o usuário
    } catch (error) {
        console.error("Erro detalhado:", error); // Use 'error', não 'resposta'
        alert('Ocorreu um erro ao enviar o e-mail.');
    }
    finally {
        // Restaura o botão ao estado normal
        btnElement.innerHTML = textoOriginal;
        btnElement.disabled = false;
    }
}
