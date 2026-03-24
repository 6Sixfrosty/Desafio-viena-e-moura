create database construtora;
use construtora;

CREATE TABLE unidades (
    id_unidade INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(5) DEFAULT 'Menor',
    data_inicio DATE default (CURRENT_DATE)
);

CREATE TABLE etapas (
    id_etapa INT AUTO_INCREMENT PRIMARY KEY,
    ordem INT NOT NULL,
    nome VARCHAR(100)
);

CREATE TABLE departamentos (
    id_departamento INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100)
);

CREATE TABLE funcoes (
    id_funcao INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100)
);

CREATE TABLE colaboradores (
    id_colaborador INT AUTO_INCREMENT,
    id_departamento INT,
    id_funcao INT,
    nome VARCHAR(100),
    cpf VARCHAR(11),

	PRIMARY KEY (id_colaborador),

    FOREIGN KEY (id_departamento)
		REFERENCES departamentos(id_departamento),

    FOREIGN KEY (id_funcao)
		REFERENCES funcoes(id_funcao)
);

CREATE TABLE registro_diario (
    id_registro INT AUTO_INCREMENT PRIMARY KEY,
    id_colaborador INT,
    id_unidade INT,
    id_etapa INT,
    data DATE,
    horario_entrada TIME,
    horario_saida TIME
);

CREATE TABLE materiais (
    id_material INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    unidade_medida VARCHAR(20)
);

CREATE TABLE armazem (
    id_armazem INT AUTO_INCREMENT PRIMARY KEY,
    id_material INT,
    saldo_atual INT DEFAULT 0,
    sobras INT DEFAULT 0,
    destrocos INT DEFAULT 0,

    FOREIGN KEY (id_material)
        REFERENCES materiais(id_material)
);

CREATE TABLE pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_unidade INT,
    id_material INT,
    quantidade_solicitada INT,
    quantidade_devolvida INT DEFAULT 0,
    data_pedido DATE,

    FOREIGN KEY (id_unidade)
        REFERENCES unidades(id_unidade),

    FOREIGN KEY (id_material)
        REFERENCES materiais(id_material)
);

CREATE TABLE pedidos_detalhes (
    id_detalhe INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT,
    id_colaborador INT,
    id_etapa INT,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alocacao_colaboradores (
    id_alocacao INT AUTO_INCREMENT PRIMARY KEY,
    id_colaborador INT,

    FOREIGN KEY (id_colaborador)
        REFERENCES colaboradores(id_colaborador),
);

CREATE TABLE progressao_unidade (
    id_progressao INT AUTO_INCREMENT PRIMARY KEY,
    id_unidade INT,
    id_etapa INT,
    id_alocacao INT,

    FOREIGN KEY (id_unidade)
        REFERENCES unidades(id_unidade),

    FOREIGN KEY (id_etapa)
        REFERENCES etapas(id_etapa),

    FOREIGN KEY (id_alocacao)
        REFERENCES alocacao_colaboradores(id_alocacao)
);

CREATE TABLE movimentacoes_armazem (
    id_movimentacao INT AUTO_INCREMENT PRIMARY KEY,
    id_armazem INT,
    tipo VARCHAR(15),
    quantidade INT,
    data DATE,
    fornecedor VARCHAR(100)
);