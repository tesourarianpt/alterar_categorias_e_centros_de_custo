const { ids_centros_de_custo } = require("./ids_centros_de_custo");
const { ids_categorias } = require("./ids_categorias");

const rubricas = {
  fundo_beneficente: {
    nome: "Fundo Beneficente",
    categoria_id: ids_categorias.fundo_beneficente,
    centro_custo_lucro_id: ids_centros_de_custo.ID_FUNDOS_DG,
  },
  fundo_ambiental: {
    nome: "Fundo Ambiental",
    categoria_id: ids_categorias.fundo_ambiental,
    centro_custo_lucro_id: ids_centros_de_custo.ID_FUNDOS_DG,
  },
  fundo_de_participacao: {
    nome: "Fundo de Participação",
    categoria_id: ids_categorias.fundo_de_participacao,
    centro_custo_lucro_id: ids_centros_de_custo.ID_FUNDOS_DG,
  },
  fundo_de_saude: {
    nome: "Fundo de Saúde",
    categoria_id: ids_categorias.fundo_de_saude,
    centro_custo_lucro_id: ids_centros_de_custo.ID_FUNDOS_DG,
  },
  fundo_regional: {
    nome: "Fundo Regional",
    categoria_id: ids_categorias.fundo_regional,
    centro_custo_lucro_id: ids_centros_de_custo.ID_FUNDO_REGIONAL,
  },
  taxa_de_preparo: {
    nome: "Taxa de Preparo",
    categoria_id: ids_categorias.taxa_de_preparo,
    centro_custo_lucro_id: ids_centros_de_custo.ID_PREPARO,
  },
  taxa_de_alimentacao: {
    nome: "Taxa de Alimentação",
    categoria_id: ids_categorias.taxa_de_alimentacao,
    centro_custo_lucro_id: ids_centros_de_custo.ID_ALIMENTACAO,
  },
  emergencia: {
    nome: "Mensalidade : Emergência",
    categoria_id: ids_categorias.mensalidade,
    centro_custo_lucro_id: ids_centros_de_custo.ID_EMERGENCIA,
  },
  zelador: {
    nome: "Mensalidade : Zelador",
    categoria_id: ids_categorias.mensalidade,
    centro_custo_lucro_id: ids_centros_de_custo.ID_ZELADOR,
  },
  presidencia: {
    nome: "Mensalidade : Presidência",
    categoria_id: ids_categorias.mensalidade,
    centro_custo_lucro_id: ids_centros_de_custo.ID_PRESIDENCIA,
  },
  despesas_fixas: {
    nome: "Mensalidade : Despesas Fixas",
    categoria_id: ids_categorias.mensalidade,
    centro_custo_lucro_id: ids_centros_de_custo.ID_DESPESAS_FIXAS,
  },
  taxa_de_plantio: {
    nome: "Taxa de Plantio",
    categoria_id: ids_categorias.taxa_de_plantio,
    centro_custo_lucro_id: ids_centros_de_custo.ID_PREPARO,
  },
  casa_da_uniao: {
    nome: "Casa da União",
    categoria_id: ids_categorias.casa_da_uniao,
    centro_custo_lucro_id: ids_centros_de_custo.ID_CASA_DA_UNIAO,
  },
  novo_encanto_geral: {
    nome: "Novo Encanto Geral",
    categoria_id: ids_categorias.novo_encanto,
    centro_custo_lucro_id: ids_centros_de_custo.ID_NE_GERAL,
  },
  novo_encanto_local: {
    nome: "Novo Encanto Local",
    categoria_id: ids_categorias.novo_encanto,
    centro_custo_lucro_id: ids_centros_de_custo.ID_NE_LOCAL,
  },
  taxa_de_boleto: {
    nome: "Taxa de Boleto",
    categoria_id: ids_categorias.casa_da_uniao,
    centro_custo_lucro_id: ids_centros_de_custo.ID_DESPESAS_FIXAS,
  },
};

exports.rubricas = rubricas;
