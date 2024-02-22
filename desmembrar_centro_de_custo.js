const {
  agruparPorLancamentoComposto,
} = require("./alterar_categorias_e_centros_de_custo/agruparPorLancamentoComposto");
const {
  pedirAccessTokenSeNaoDefinido,
} = require("./pedirAccessTokenSeNaoDefinido");
const {
  alterar_lancamento,
} = require("./alterar_categorias_e_centros_de_custo/alterar_lancamento");
const {
  desmembrarMensalidade,
} = require("./desmembrar_centro_de_custo/desmembrarMensalidade");
const {
  desmembrarFundos,
} = require("./desmembrar_centro_de_custo/desmembrarFundos");
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

const filtro = {
  conta_id: 75063,
  centro_custo_lucro_id: 141875,
  data_inicio: "2024-05-01",
  data_fim: "2024-05-31",
  tipo: "R|LR|RA",
};

function padString(str, width) {
  if (!str) {
    return " ".repeat(width);
  }
  const padding = " ".repeat(width - str.toString().length);
  return str + padding;
}

function mostrarLancamentos(lancamentos, title) {
  // mostrar em tabela
  // ordenar pelo nome
  // mostrar total ou totais
  // mostrar o nome do centro de custo
  console.log(`\n-------------------${title}-------------------- `);
  lancamentos.sort((a, b) => a.descricao.localeCompare(b.descricao));
  lancamentos.forEach((lancamento, index) => {
    console.log(
      `${padString(index, 2)} - ${padString(
        lancamento.id ? lancamento.id : "- NOVO -",
        9
      )} - ${padString(lancamento.descricao, 50)} - ${padString(
        lancamento.centro_custo_lucro_id,
        10
      )} - ${padString(lancamento.valor, 8)}`
    );
  });
  console.log("--------------------------------------- \n");
  const total = lancamentos
    .reduce((sum, l) => sum + parseFloat(l.valor), 0)
    .toFixed(2);
  console.log(`total ${total} \n`);
  const isMensalidade = (l) =>
    l.descricao.toLowerCase().includes("mensalidade");

  const totalMensalidade = lancamentos
    .reduce((sum, l) => {
      return sum + (isMensalidade(l) ? parseFloat(l.valor) : 0);
    }, 0)
    .toFixed(2);
  console.log(`total mensalidade ${totalMensalidade} \n`);
  console.log("--------------------------------------- \n");
}

async function main(accessToken) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const askQuestion = (question) =>
    new Promise((resolve) => rl.question(question, resolve));

  const { listar_clientes } = require("./ler_clientes/listar_clientes");
  const socios = await listar_clientes(accessToken, true);
  console.log(`Lidos: ${socios.length} socios`);
  const lancamentos = await lerTodosLancamentos(accessToken, filtro);
  console.log(`Lidos: ${lancamentos.length} lancamentos`);
  const sociosELancamentosCompostos = unirSociosELancamentosCompostos(
    socios,
    lancamentos
  );

  let i = 0;

  let lancamentoCompostoPorSocioCount = 0;
  await askQuestion("prosseguir....");
  for (const sl of Object.keys(sociosELancamentosCompostos)) {
    const socioaELancamentoComposto = sociosELancamentosCompostos[sl];
    const temLancamentoComposto =
      !!socioaELancamentoComposto.lancamento_composto_id;

    if (temLancamentoComposto) {
      const lancamentoId = socioaELancamentoComposto.lancamento_id;
      console.log(
        `${socioaELancamentoComposto.nome} - Lançamento Composto: ${socioaELancamentoComposto.lancamento_composto_id} - Lançamento: ${lancamentoId}`
      );

      await askQuestion("[ver lançamento...]");
      const lancamento = await lerLancamento(accessToken, lancamentoId);
      const lancamentosNaoAninhados = [
        lancamento,
        ...lancamento.itens_adicionais,
      ];
      mostrarLancamentos(lancamentosNaoAninhados, "atual");
      // verificar se já não está desmembrado. Se estiver, pula para o próximo.
      await askQuestion("[ver novo lançamento...]");
      let lancamentosDesmembrados = desmembrarNovoEncanto(
        lancamentosNaoAninhados
      );
      lancamentosDesmembrados = desmembrarFundos(lancamentosDesmembrados);
      lancamentosDesmembrados = desmembrarMensalidade(lancamentosDesmembrados);
      mostrarLancamentos(lancamentosDesmembrados, "desmembrados");
      await askQuestion("[desmembrar...]");
      //   const { id, dados } = comporDadosAlteracao(lancamentos, dataVencimento);
      //   alterar_lancamento(accessToken, id, dados);
      await askQuestion("[próximo sócio...]");
    } else {
      console.log(`${socioaELancamentoComposto.nome} - NÃO TEM MENSALIDADE`);
      await askQuestion("[próximo sócio...]");
    }
  }
}

pedirAccessTokenSeNaoDefinido(main);

// todo:
/*
 - adicionar nome da pessoa em cada rubrica
*/
