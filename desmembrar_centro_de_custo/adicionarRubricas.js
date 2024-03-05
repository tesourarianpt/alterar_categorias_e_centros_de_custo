const { centros_de_custo } = require("./centros_de_custo");
const { ids_categorias } = require("./ids_categorias");
const { countNumFundosParticipacao } = require("./countNumFundosParticipacao");
const { mostrarLancamentos } = require("../lib/mostrarLancamentos");

const temLancamentoComCategoria = (lancamentos, id) => {
  return !!lancamentos.find((l) => (l.categoria_id = id));
};

const temLancamentoComCentroDeCusto = (lancamentos, id) => {
  return !!lancamentos.find((l) => l.centro_custo_lucro_id === id);
};

function adicionarRubricas(
  lancamentos,
  nomePrincipal,
  centrosDeCusto,
  categorias
) {
  const numSocios = countNumFundosParticipacao(lancamentos);
  const grupos = {};

  console.log(" ADICIONAR RUBRICAS ---- ", nomePrincipal);
  lancamentos.forEach((lancamento) => {
    const descricao = lancamento.descricao;
    const nome = descricao.split("-").pop();
    grupos.hasOwnProperty(nome) || (grupos[nome] = []);
    grupos[nome].push(lancamento);
  });

  Object.keys(grupos).forEach((nome) => {
    const lancamentosDaPessoa = grupos[nome];
    // garantir que cada um tem

    // - 4 fundos da dg ( se não tiver, avisa )
    if (
      !temLancamentoComCategoria(
        lancamentosDaPessoa,
        ids_categorias.fundo_ambiental
      )
    ) {
      console.log("ERRO: NÃO TEM FUNDO AMBIENTAL");
    }
    if (
      !temLancamentoComCategoria(
        lancamentosDaPessoa,
        ids_categorias.fundo_beneficente
      )
    ) {
      console.log("ERRO: NÃO TEM FUNDO BENEFICENTE");
    }
    if (
      !temLancamentoComCategoria(
        lancamentosDaPessoa,
        ids_categorias.fundo_de_participacao
      )
    ) {
      console.log("ERRO: NÃO TEM FUNDO DE PARTICIPAÇÃO");
    }
    if (
      !temLancamentoComCategoria(
        lancamentosDaPessoa,
        ids_categorias.fundo_de_saude
      )
    ) {
      console.log("ERRO: NÃO TEM FUNDO DE SAÚDE");
    }

    // - fundo regional ( se não tiver, avisa )
    if (
      !temLancamentoComCategoria(
        lancamentosDaPessoa,
        ids_categorias.fundo_regional
      )
    ) {
      console.log("ERRO: NÃO TEM FUNDO REGIONAL");
    }

    // - preparo ( se não tiver, avisa e cria )
    if (
      !temLancamentoComCategoria(
        lancamentosDaPessoa,
        ids_categorias.taxa_de_preparo
      )
    ) {
      console.log("criar taxa de preparo");
    }

    // - alimentação ( se não tiver, avisa e cria )
    if (
      !temLancamentoComCategoria(
        lancamentosDaPessoa,
        ids_categorias.taxa_de_alimentacao
      )
    ) {
      console.log("criar taxa de alimentação");
    }

    // - 4 items da mensalidade ( se não tiver, avisa e cria )

    const itens_mensalidade = lancamentosDaPessoa.filter(
      (l) => l.categoria_id === ids_categorias.mensalidade
    );
    if (!itens_mensalidade.length === 4) {
      console.log("NÃO TEM AS 4 RUBRICAS DA MENSALIDADE");
    }

    // mensalidade - despesas fixas
    if (
      !temLancamentoComCentroDeCusto(
        lancamentosDaPessoa,
        centros_de_custo.ID_MENSALIDADE_DESPESAS_FIXAS
      )
    ) {
      console.log("criar mensalidade - despesas fixas");
    }

    // mensalidade - zelador
    if (
      !temLancamentoComCentroDeCusto(
        lancamentosDaPessoa,
        centros_de_custo.ID_MENSALIDADE_ZELADOR
      )
    ) {
      console.log("criar mensalidade - zelador");
    }

    // mensalidade - presidencia
    if (
      !temLancamentoComCentroDeCusto(
        lancamentosDaPessoa,
        centros_de_custo.ID_MENSALIDADE_PRESIDENCIA
      )
    ) {
      console.log("criar mensalidade - presidencia");
    }

    // mensalidade - emergência
    if (
      !temLancamentoComCentroDeCusto(
        lancamentosDaPessoa,
        centros_de_custo.ID_MENSALIDADE_EMERGENCIA
      )
    ) {
      console.log("criar mensalidade - emergência");
    }

    // - plantio ( se não tiver, avisa e cria )

    // - novo encanto ( se não tiver, avisa e cria )

    // - casa da união ( se não tiver, avisa e cria )

    mostrarLancamentos(centrosDeCusto, categorias, grupos[nome], nome);
  });

  if (numSocios > 1) {
    console.log({ numSocios });
  } else {
    console.log("Um sócio");
  }
  return lancamentos;
}
exports.adicionarRubricas = adicionarRubricas;
