const {
  mapear_categoria,
} = require("./desmembrar_centro_de_custo/mapear_categoria");
// const {
//   agruparPorLancamentoComposto,
// } = require("./desmembrar_centro_de_custo/agruparPorLancamentoComposto");
const {
  pedirAccessTokenSeNaoDefinido,
} = require("./pedirAccessTokenSeNaoDefinido");
const {
  alterar_lancamento,
} = require("./desmembrar_centro_de_custo/alterar_lancamento");
const {
  desmembrarMensalidade,
} = require("./desmembrar_centro_de_custo/desmembrarMensalidade");
const {
  mudarCentroDeCustoDoFundoRegional,
} = require("./desmembrar_centro_de_custo/mudarCentroDeCustoDoFundoRegional");
const {
  desmembrarNovoEncanto,
} = require("./desmembrar_centro_de_custo/desmembrarNovoEncanto");
const {
  comporDadosAlteracao,
} = require("./desmembrar_centro_de_custo/comporDadosAlteracao");
const { listar_clientes } = require("./ler_clientes/listar_clientes");
const {
  unirSociosELancamentosCompostos,
} = require("./desmembrar_centro_de_custo/unirSociosELancamentosCompostos");
const {
  lerTodosLancamentos,
} = require("./desmembrar_centro_de_custo/lerTodosLancamentos");
const readline = require("readline");
const { lerLancamento } = require("./lib/lerLancamento");
const {
  ler_centros_de_custo_agrupados,
} = require("./lib/ler_centros_de_custo_agrupados");
const { ler_categorias_agrupadas } = require("./lib/ler_categorias_agrupadas");
const { mostrarLancamentos } = require("./lib/mostrarLancamentos");
const {
  ajustarNomesDasRubricas,
} = require("./desmembrar_centro_de_custo/ajustarNomesDasRubricas");
const {
  adicionarRubricas,
} = require("./desmembrar_centro_de_custo/adicionarRubricas");
const {
  ids_centros_de_custo,
} = require("./desmembrar_centro_de_custo/ids_centros_de_custo");

const createAskQuestion = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return (question) => new Promise((resolve) => rl.question(question, resolve));
};

const lerLancamentosDG = async (accessToken) => {
  const lancamentos = await lerTodosLancamentos(accessToken, {
    conta_id: 75063,
    centro_custo_lucro_id: ids_centros_de_custo.ID_FUNDOS_DG,
    data_inicio: "2024-04-01",
    data_fim: "2024-04-30",
    tipo: "R|LR|RA",
  });
  console.log(`Lidos: ${lancamentos.length} lancamentos`);
  return lancamentos;
};

async function main(accessToken) {
  const centrosDeCusto = await ler_centros_de_custo_agrupados(accessToken);
  const categorias = await ler_categorias_agrupadas(accessToken);
  const askQuestion = createAskQuestion();

  const socios = await listar_clientes(accessToken, true);
  console.log(`Lidos: ${socios.length} socios`);
  const lancamentosDG = await lerLancamentosDG(accessToken);

  const sociosELancamentosCompostos = unirSociosELancamentosCompostos(
    socios,
    lancamentosDG
  );

  let i = 0;

  for (const sl of Object.keys(sociosELancamentosCompostos)) {
    const socioaELancamentoComposto = sociosELancamentosCompostos[sl];
    const temLancamentoComposto =
      !!socioaELancamentoComposto.lancamento_composto_id;

    if (temLancamentoComposto) {
      const lancamentoId = socioaELancamentoComposto.lancamento_id;
      console.log(
        `${socioaELancamentoComposto.nome} - Lançamento Composto: ${socioaELancamentoComposto.lancamento_composto_id} - Lançamento: ${lancamentoId}`
      );
      const lancamento = await lerLancamento(accessToken, lancamentoId);
      const lancamentosNaoAninhados = [
        lancamento,
        ...lancamento.itens_adicionais,
      ];

      mostrarLancamentos(
        centrosDeCusto,
        categorias,
        lancamentosNaoAninhados,
        "lançamento lidos..."
      );

      // verificar se já não está desmembrado. Se estiver, pula para o próximo.
      let lancamentosDesmembrados = ajustarNomesDasRubricas(
        lancamentosNaoAninhados,
        socioaELancamentoComposto.nome_fantasia
      );
      lancamentosDesmembrados = lancamentosDesmembrados.map((l) => {
        l.categoria_id = mapear_categoria(l.categoria_id);
        return l;
      });

      lancamentosDesmembrados = desmembrarNovoEncanto(lancamentosDesmembrados);
      lancamentosDesmembrados = mudarCentroDeCustoDoFundoRegional(
        lancamentosDesmembrados
      );
      lancamentosDesmembrados = desmembrarMensalidade(lancamentosDesmembrados);

      mostrarLancamentos(
        centrosDeCusto,
        categorias,
        lancamentosDesmembrados,
        "antes de adicionar"
      );
      lancamentosDesmembrados = adicionarRubricas(
        lancamentosDesmembrados,
        socioaELancamentoComposto.nome,
        centrosDeCusto,
        categorias
      );
      mostrarLancamentos(
        centrosDeCusto,
        categorias,
        lancamentosDesmembrados,
        "prontos para alterar"
      );

      const { id, dados } = comporDadosAlteracao(
        lancamentosDesmembrados,
        lancamento.data_vencimento
      );
      await askQuestion("[desmembrar...]");
      alterar_lancamento(accessToken, id, dados);
      await askQuestion("[próximo sócio...]");
    } else {
      console.log(`${socioaELancamentoComposto.nome} - NÃO TEM MENSALIDADE`);
      await askQuestion("[próximo sócio...]");
    }
  }
}
pedirAccessTokenSeNaoDefinido(main);
