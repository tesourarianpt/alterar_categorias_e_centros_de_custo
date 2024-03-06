const { ids_centros_de_custo } = require("./ids_centros_de_custo");
const { ids_categorias } = require("./ids_categorias");
const { rubricas } = require("./rubricas");
const { countNumFundosParticipacao } = require("./countNumFundosParticipacao");
const { mostrarLancamentos } = require("../lib/mostrarLancamentos");

const temLancamentoComCategoria = (lancamentos, id) => {
  return !!lancamentos.find((l) => l.categoria_id === id);
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
  const lancamentoFundoDeParticipacao = lancamentos.find(
    (l) =>
      String(l.categoria_id) === String(ids_categorias.fundo_de_participacao)
  );
  if (lancamentoFundoDeParticipacao.length < 1)
    throw "Fundo de participação não encontrado";
  const lancamentoBase = { ...lancamentoFundoDeParticipacao };
  delete lancamentoBase.id;

  lancamentos.forEach((lancamento) => {
    const descricao = lancamento.descricao;
    const nome = descricao.split("-").pop().trim();
    grupos.hasOwnProperty(nome) || (grupos[nome] = []);
    grupos[nome].push(lancamento);
  });

  const nomesDasPessoas = Object.keys(grupos);

  console.log(`Adicionar rubricas para ${nomePrincipal}`);
  console.log(
    `${nomesDasPessoas.length} Sócios encontrados: ${Object.keys(grupos)}`
  );

  const novosLancamentos = [];

  function criarRubricaZerada(rubrica, nomeDaPessoa) {
    const novoLancamento = { ...lancamentoBase };
    novoLancamento.centro_custo_lucro_id = rubrica.centro_custo_lucro_id;
    novoLancamento.descricao = `${rubrica.nome} - ${nomeDaPessoa}`;
    novoLancamento.categoria_id = rubrica.categoria_id;
    novoLancamento.valor = 0;
    return novoLancamento;
  }

  nomesDasPessoas.forEach((nome) => {
    const lancamentosDaPessoa = grupos[nome];
    console.log(`Rubricas de ${nome}...`);

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
    if (
      !temLancamentoComCategoria(
        lancamentosDaPessoa,
        ids_categorias.fundo_regional
      )
    ) {
      console.log("ERRO: NÃO TEM FUNDO REGIONAL");
    }
    if (
      !temLancamentoComCategoria(
        lancamentosDaPessoa,
        ids_categorias.taxa_de_alimentacao
      )
    ) {
      console.log("criar taxa de alimentação");
      novosLancamentos.push(
        criarRubricaZerada(rubricas.taxa_de_alimentacao, nome)
      );
    }
    const itens_mensalidade = lancamentosDaPessoa.filter(
      (l) => l.categoria_id === ids_categorias.mensalidade
    );
    if (!itens_mensalidade.length === 4) {
      console.log("NÃO TEM AS 4 RUBRICAS DA MENSALIDADE");
      novosLancamentos.push(criarRubricaZerada(rubricas.casa_da_uniao, nome));
    }
    if (
      !temLancamentoComCentroDeCusto(
        lancamentosDaPessoa,
        ids_centros_de_custo.ID_DESPESAS_FIXAS
      )
    ) {
      console.log("criar mensalidade - despesas fixas");
      novosLancamentos.push(criarRubricaZerada(rubricas.despesas_fixas, nome));
    }
    if (
      !temLancamentoComCentroDeCusto(
        lancamentosDaPessoa,
        ids_centros_de_custo.ID_ZELADOR
      )
    ) {
      console.log("criar mensalidade - zelador");
      novosLancamentos.push(criarRubricaZerada(rubricas.zelador, nome));
    }
    if (
      !temLancamentoComCentroDeCusto(
        lancamentosDaPessoa,
        ids_centros_de_custo.ID_PRESIDENCIA
      )
    ) {
      console.log("criar mensalidade - presidencia");
      novosLancamentos.push(criarRubricaZerada(rubricas.presidencia, nome));
    }
    if (
      !temLancamentoComCentroDeCusto(
        lancamentosDaPessoa,
        ids_centros_de_custo.ID_EMERGENCIA
      )
    ) {
      console.log("criar mensalidade - emergência");
      novosLancamentos.push(criarRubricaZerada(rubricas.emergencia, nome));
    }
    if (
      !temLancamentoComCentroDeCusto(
        lancamentosDaPessoa,
        ids_centros_de_custo.ID_PLANTIO
      )
    ) {
      console.log("criar taxa de plantio");
      novosLancamentos.push(criarRubricaZerada(rubricas.taxa_de_plantio, nome));
    }
    if (
      !temLancamentoComCentroDeCusto(
        lancamentosDaPessoa,
        ids_centros_de_custo.ID_PREPARO
      )
    ) {
      console.log("criar taxa de preparo");
      novosLancamentos.push(criarRubricaZerada(rubricas.taxa_de_preparo, nome));
    }
    if (
      !temLancamentoComCentroDeCusto(
        lancamentosDaPessoa,
        ids_centros_de_custo.ID_NE_LOCAL
      )
    ) {
      console.log("criar ne local");
      novosLancamentos.push(
        criarRubricaZerada(rubricas.novo_encanto_local, nome)
      );
    }
    if (
      !temLancamentoComCentroDeCusto(
        lancamentosDaPessoa,
        ids_centros_de_custo.ID_NE_GERAL
      )
    ) {
      console.log("criar ne geral");
      novosLancamentos.push(
        criarRubricaZerada(rubricas.novo_encanto_geral, nome)
      );
    }
    if (
      !temLancamentoComCentroDeCusto(
        lancamentosDaPessoa,
        ids_centros_de_custo.ID_CASA_DA_UNIAO
      )
    ) {
      console.log("criar casa da união");
      novosLancamentos.push(criarRubricaZerada(rubricas.casa_da_uniao, nome));
    }
    mostrarLancamentos(
      centrosDeCusto,
      categorias,
      [...novosLancamentos, ...grupos[nome]],
      `Rubricas de ${nome}`
    );
  });

  if (numSocios > 1) {
    console.log({ numSocios });
  } else {
    console.log("Um sócio");
  }
  return [...lancamentos, ...novosLancamentos];
}
exports.adicionarRubricas = adicionarRubricas;
