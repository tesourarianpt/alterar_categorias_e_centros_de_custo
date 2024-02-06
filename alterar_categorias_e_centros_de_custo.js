// ler lançamentos
// fazer um loop por cada lançamento
// para o centro de custo
// verificar se está na list de-para
// se estiver, alterar e atualizar o lançamento
// para a categoria
// verificar se está na list de-para
// se estiver, alterar e atualizar o lançamento
// const axios = require('axios');
const {
  ler_lancamentos,
} = require("./alterar_categorias_e_centros_de_custo/ler_lancamentos");
const {
  mapear_categoria,
} = require("./alterar_categorias_e_centros_de_custo/mapear_categoria");
const {
  recupera_id_composto,
} = require("./alterar_categorias_e_centros_de_custo/baseIdCompostoFev24");
const {
  alterar_lancamento,
} = require("./alterar_categorias_e_centros_de_custo/alterar_lancamento");
const readline = require("readline");
const {
  agruparPorLancamentoComposto,
} = require("./agruparPorLancamentoComposto");

function ordenarPorId(lancamentos) {
  lancamentos.sort((a, b) => a.id - b.id);
}

async function main(accessToken) {
  for (let chave = 1; chave <= 2; chave++) {
    const filtro = {
      limit: 50,
      // pessoa_id: 1381570,
      lancamento_composto_id: parseInt(recupera_id_composto(chave)), //3342873,
      data_inicio: "2024-02-01",
      data_fim: "2024-02-29",
      tipo: "R|LR",
      conta_id: 75063,
    };
    //console.log(i);




    const lancamentos = await ler_lancamentos(accessToken, filtro);
    console.log(`Lidos: ${lancamentos.length} lançamentos`);
    const lancamentosCompostos = agruparPorLancamentoComposto(lancamentos);

    Object.keys(lancamentosCompostos).forEach((lancamento_composto_id) => {
      const lancamentos = lancamentosCompostos[lancamento_composto_id];
      ordenarPorId(lancamentos);
      const primeiroLancamento = lancamentos.shift();
      console.log(`Lançamento Composto ${lancamento_composto_id} \n Primeiro item: ${primeiroLancamento.descricao}`);

      const dadosAlteracao = {
        categoria_id: parseInt(mapear_categoria(primeiroLancamento.categoria_id)),
        //propagar_alteracao: true,
        data_vencimento: primeiroLancamento.data_vencimento,
        itens_adicionais: lancamentos.map((lancamento) => ({
          id: lancamento.id,
          categoria_id: parseInt(mapear_categoria(lancamento.categoria_id)),
          // descricao: lancamento.descricao,
          // valor: lancamento.valor,
        })),
      };
      // console.log(dadosAlteracao);

      alterar_lancamento(accessToken, primeiroLancamento.id, dadosAlteracao);
    });
  }
}

async function pegarDadosUsuario() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const askQuestion = (question) =>
    new Promise((resolve) => rl.question(question, resolve));

  let accessToken;
  if (process.env.ACCESS_TOKEN) {
    accessToken = process.env.ACCESS_TOKEN;
  } else {
    accessToken = await askQuestion("Qual o access token?");
  }
  rl.close();
  main(accessToken);
}

pegarDadosUsuario();
