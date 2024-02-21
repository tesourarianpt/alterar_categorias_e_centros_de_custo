const { ler_lancamentos } = require("../lib/ler_lancamentos");

async function lerTodosLancamentos(accessToken, filtro) {
  filtro.limit = 500;
  filtro.start = 0;
  let lancamentos = [];
  while (true) {
    console.log(filtro);
    const novosLancamentos = await ler_lancamentos(accessToken, filtro);
    lancamentos = [...lancamentos, ...novosLancamentos];
    if (novosLancamentos.length < 500) break;
    if (lancamentos.length > 1000) break;
    filtro.start = filtro.start + 500;
  }

  return lancamentos;
}
exports.lerTodosLancamentos = lerTodosLancamentos;
