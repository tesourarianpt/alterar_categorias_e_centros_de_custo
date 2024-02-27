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
const { ler_centros_de_custo } = require("./lib/ler_centros_de_custo");

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

const CATEGORIA_ID_FUNDO_PARTICIPACAO = 1018689;

function mostrarLancamentos(centrosDeCusto, lancamentos, title) {
  // mostrar o nome do centro de custo
  console.log(`\n-------------------${title}-------------------- `);
  lancamentos.sort((a, b) => a.descricao.localeCompare(b.descricao));
  lancamentos.forEach((lancamento, index) => {
    const i = padString(index, 2);
    const id = padString(lancamento.id ? lancamento.id : "- NOVO -", 9);
    const descricao = padString(lancamento.descricao, 50);
    const valor = padString(lancamento.valor, 8);
    const centroDeCusto = padString(
      centrosDeCusto[lancamento.centro_custo_lucro_id],
      50
    );
    console.log(`${i} - ${id} - ${descricao} - ${valor} - ${centroDeCusto}`);
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

const countNumFundosParticipacao = (ls) => {
  const numFundosDeParticipacao = ls.filter(
    (l) => l.categoria_id === CATEGORIA_ID_FUNDO_PARTICIPACAO
  ).length;
  if (numFundosDeParticipacao === 0) {
    console.log("NÃO TEM FUNDO DE PARTICIPAÇÃO");
  }
  return numFundosDeParticipacao;
};

function ajustarNomesDasRubricas(lancamentos, nome) {
  const numSocios = countNumFundosParticipacao(lancamentos);
  console.log({ numFundosParticipacao });
  if (numSocios > 1) {
    // mudar nomes para primeira minúscula
    return lancamentos;
  } else {
    const primeiraMaiuscula = (s) =>
      s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    const primeiroNome = primeiraMaiuscula(nome.trim().split(" ")[0]);
    const removerDepoisHifen = (d) =>
      d.includes("Granatum") ? d : d.split("-")[0].trim();
    return lancamentos.map((l) => ({
      ...l,
      descricao: `${removerDepoisHifen(l.descricao)} - ${primeiroNome}`,
    }));
  }
}

async function main(accessToken) {
  const centrosDeCusto = (await ler_centros_de_custo(accessToken)).reduce(
    (centros, centro) => ({ ...centros, [centro.id]: centro.descricao }),
    {}
  );

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
      mostrarLancamentos(centrosDeCusto, lancamentosNaoAninhados, "atual");
      // verificar se já não está desmembrado. Se estiver, pula para o próximo.
      await askQuestion("[ver novo lançamento...]");
      let lancamentosDesmembrados = ajustarNomesDasRubricas(
        lancamentosNaoAninhados,
        socioaELancamentoComposto.nome
      );
      lancamentosDesmembrados = desmembrarNovoEncanto(lancamentosDesmembrados);
      lancamentosDesmembrados = desmembrarFundos(lancamentosDesmembrados);
      lancamentosDesmembrados = desmembrarMensalidade(lancamentosDesmembrados);
      mostrarLancamentos(
        centrosDeCusto,
        lancamentosDesmembrados,
        "desmembrados"
      );
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
 - colocar primeira maiúscula nos nomes das rubricas para lancamentos de mais de um sócio. 
 - verificar mensalidade do P. Ferrão. A está errada

*/
