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

function mostrarLancamentos(lancamentos) {
  console.log("\n--------------------------------------- ");
  lancamentos.forEach((i) => {
    console.log(
      `${i.id} - ${i.descricao} - ${i.centro_custo_lucro_id} - ${i.valor}`
    );
  });
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
      mostrarLancamentos(lancamentosNaoAninhados);
      await askQuestion("[ver novo lançamento...]");

      let lancamentosDesmembrados = desmembrarNovoEncanto(
        lancamentosNaoAninhados
      );
      lancamentosDesmembrados = desmembrarFundos(lancamentosDesmembrados);
      lancamentosDesmembrados = desmembrarMensalidade(lancamentosDesmembrados);

      mostrarLancamentos(lancamentosDesmembrados);

      await askQuestion("[próximo sócio...]");
    } else {
      console.log(`${socioaELancamentoComposto.nome} - NÃO TEM MENSALIDADE`);
      await askQuestion("[próximo sócio...]");
    }
  }
  // console.log({ lancamentoCompostoPorSocioCount });
  // console.log(sociosELancamentosCompostos);

  // lancamentos.forEach((l) => {
  //   console.log({
  //     i: i++,
  //     id: l.id,
  //     descricao: l.descricao,
  //     lancamento_composto_id: l.lancamento_composto_id,
  //     centro_custo_lucro_id: l.centro_custo_lucro_id,
  //   });
  // });
  // // console.log(`Lidos: ${lancamentos.length} lançamentos`);
  // const lancamentosCompostos = agruparPorLancamentoComposto(lancamentos);

  // Object.keys(lancamentosCompostos).forEach((lancamento_composto_id) => {
  //   let lancamentos = lancamentosCompostos[lancamento_composto_id];
  //   const dataVencimento = lancamentos[0].data_vencimento;
  //   lancamentos = desmembrarNovoEncanto(lancamentos);
  //   lancamentos = desmembrarFundos(lancamentos);
  //   lancamentos = desmembrarMensalidade(lancamentos);
  //   const { id, dados } = comporDadosAlteracao(lancamentos, dataVencimento);
  //   alterar_lancamento(accessToken, id, dados);
  // });
}

pedirAccessTokenSeNaoDefinido(main);

// todo:
/*
 - adicionar nome da pessoa em cada rubrica
*/
