// core/api.js

export async function getInventario() {
    // Simulando o tempo de resposta do servidor (1 segundo)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Dados de teste (Mock Data)
    return [
        { 
            id: "MAT-001", 
            material: "Cimento Portland", 
            marca: "Votorantim", 
            saldoAtual: 2500, 
            estoqueMinimo: 500,
            unidade: "sc",
            status: "Disponível"
        },
        { 
            id: "MAT-007", 
            material: "Impermeabilizante", 
            marca: "Vedacit", 
            saldoAtual: 45, 
            estoqueMinimo: 100,
            unidade: "L",
            status: "Reposição Urgente"
        },
        { 
            id: "MAT-012", 
            material: "Tubo PVC 100mm", 
            marca: "Tigre", 
            saldoAtual: 15, 
            estoqueMinimo: 10,
            unidade: "un",
            status: "Estoque Baixo"
        }
    ];
}