const readline = require("readline");

async function pedirAccessTokenSeNaoDefinido(funcaoParaChamarDepois) {
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
  funcaoParaChamarDepois(accessToken);
}
exports.pedirAccessTokenSeNaoDefinido = pedirAccessTokenSeNaoDefinido;
