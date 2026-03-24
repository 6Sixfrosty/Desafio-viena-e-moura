---
config:
  fontSize: 18
  er:
    diagramPadding: 40
---
erDiagram
  DEPARTAMENTOS {
    int id_departamento PK
    varchar nome
  }
  FUNCOES {
    int id_funcao PK
    varchar nome
  }
  COLABORADORES {
    int id_colaborador PK
    int id_departamento FK
    int id_funcao FK
    varchar nome
    varchar cpf
  }
  UNIDADES {
    int id_unidade PK
    varchar tipo
    date data_inicio
  }
  ETAPAS {
    int id_etapa PK
    int ordem
    varchar nome
  }
  PROGRESSAO_UNIDADE {
    int id_progressao PK
    int id_unidade FK
    int id_etapa FK
    text id_alocacao 
  }
  REGISTRO_DIARIO {
    int id_registro PK
    int id_colaborador
    int id_unidade
    int id_etapa
    date data
    time horario_entrada
    time horario_saida
  }
  MATERIAIS {
    int id_material PK
    varchar nome
    varchar unidade_medida
  }
  ARMAZEM {
    int id_armazem PK
    int id_material FK
    int saldo_atual
    int sobras
    int destrocos
  }
  MOVIMENTACOES_ARMAZEM {
    int id_movimentacao PK
    int id_armazem FK
    varchar tipo
    int quantidade
    date data
    varchar fornecedor
  }
  PEDIDOS {
    int id_pedido PK
    int id_unidade 
    int id_material
    int quantidade_solicitada
    int quantidade_devolvida
    int id_detalhe
    int id_pedido 
    int id_colaborador
    int id_etapa
    timestamp data_hora
  }
  Historico_unidades {
    int id_historico_unidade PK
    int id_unidade
    int id_etapa
    text id_alocacao
  }
  DEPARTAMENTOS ||--o{ COLABORADORES : "pertence a"
  FUNCOES ||--o{ COLABORADORES : "exerce"
  COLABORADORES ||--o{ PROGRESSAO_UNIDADE : "alocado em"
  UNIDADES ||--o{ PROGRESSAO_UNIDADE : "tem"
  ETAPAS ||--o{ PROGRESSAO_UNIDADE : "compoe"
  MATERIAIS ||--o{ ARMAZEM : "compra"
  ARMAZEM ||--o{ MOVIMENTACOES_ARMAZEM : "registra"
  ARMAZEM ||--o{ PEDIDOS : "envia para"
  UNIDADES ||--o{ PEDIDOS : "solicita"
  
  PROGRESSAO_UNIDADE ||--o{ Historico_unidades: "salvo em"