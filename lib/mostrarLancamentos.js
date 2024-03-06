function padString(str, width) {
  if (!str) {
    return " ".repeat(width);
  }
  const padding = " ".repeat(width - str.toString().length);
  return str + padding;
}
function mostrarLancamentos(centrosDeCusto, categorias, lancamentos, title) {
  // mostrar o nome do centro de custo
  console.log(`\n-------------------${title}-------------------- `);
  lancamentos.sort((a, b) => a.descricao.localeCompare(b.descricao));
  lancamentos.forEach((lancamento, index) => {
    const i = padString(index + 1, 2);
    const id = padString(lancamento.id ? lancamento.id : "- NOVO -", 20);
    const descricao = padString('"' + lancamento.descricao + '"', 100);
    const valor = padString(lancamento.valor, 8);
    const centroDeCusto = padString(
      centrosDeCusto[lancamento.centro_custo_lucro_id],
      50
    );
    const categoria = categorias[lancamento.categoria_id];
    console.log(
      `${i} - ${id} - ${descricao} - ${valor} - ${centroDeCusto} - ${lancamento.centro_custo_lucro_id}\n`,
      "\033[90m",
      `${lancamento.categoria_id} - ${categoria}`,
      "\033[0m"
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
exports.mostrarLancamentos = mostrarLancamentos;
