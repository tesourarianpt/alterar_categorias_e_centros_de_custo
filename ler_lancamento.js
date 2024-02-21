const readline = require("readline");
const { lerLancamento } = require("./lib/lerLancamento");

async function main(accessToken, lancamentoId) {
  const lancamento = await lerLancamento(accessToken, lancamentoId);
  console.log(lancamento);
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
  const lancamentoId = await askQuestion("Qual o id do lançamento?");
  rl.close();
  main(accessToken, lancamentoId);
}

pegarDadosUsuario();
