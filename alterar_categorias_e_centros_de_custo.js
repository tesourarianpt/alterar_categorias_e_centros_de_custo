// ler lançamentos
// fazer um loop por cada lançamento
// para o centro de custo
// verificar se está na list de-para
// se estiver, alterar e atualizar o lançamento
// para a categoria
// verificar se está na list de-para
// se estiver, alterar e atualizar o lançamento
// const axios = require('axios');
const { ler_lancamentos } = require("./ler_lancamentos");
const { mapear_categoria } = require("./mapear_categoria");
const { alterar_lancamento } = require("./alterar_lancamento");
const readline = require("readline");

async function main(accessToken) {
  const filtro = {};
  console.log("lendo lançamentos...");
  const lancamentos = await ler_lancamentos(accessToken, filtro);
  console.log(`${lancamentos.length} lançamentos lidos com sucesso`);
  console.log(lancamentos);

  lancamentos.forEach((lancamento) => {
    const categoria_id = lancamento.categoria_id;
    // console.log(lancamento);
    const nova_categoria = mapear_categoria(categoria_id);
    if (nova_categoria) {
      console.log(
        `${lancamento.descricao} - Categoria ${categoria_id} mapeada para ${nova_categoria}`
      );
      alterar_lancamento(accessToken, lancamento.id, {
        categoria_id: parseInt(nova_categoria),
        propagar_alteracao: true,
      });
    } else {
      console.log(`A categoria ${categoria_id} não está no de-para`);
    }

    console.log(categoria_id);
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Qual o access token?", (accessToken) => {
  rl.close();
  main(accessToken);
});
