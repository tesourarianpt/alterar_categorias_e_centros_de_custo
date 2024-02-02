function agruparPorLancamentoComposto(lancamentos) {
  const lancamentosCompostos = {};

  lancamentos.forEach((lancamento) => {
    if (!lancamentosCompostos[lancamento.lancamento_composto_id]) {
      lancamentosCompostos[lancamento.lancamento_composto_id] = [];
    }
    lancamentosCompostos[lancamento.lancamento_composto_id].push({
      id: lancamento.id,
      descricao: lancamento.descricao,
      categoria_id: lancamento.categoria_id,
      valor: lancamento.valor,
      centro_custo_lucro_id: lancamento.centro_custo_lucro_id,
      lancamento_composto_id: lancamento.lancamento_composto_id,
      data_vencimento: lancamento.data_vencimento,
    });
  });
  return lancamentosCompostos;
}
exports.agruparPorLancamentoComposto = agruparPorLancamentoComposto;
