function unirSociosELancamentosCompostos(socios, lancamentos) {
  let sociosELancamentosCompostos = {};
  socios.forEach((s) => {
    sociosELancamentosCompostos[s.id] = {
      id: s.id,
      nome: s.nome,
      nome_fantasia: s.nome_fantasia,
      lancamento_composto_id: null,
    };
  });

  lancamentos.forEach((l) => {
    if (sociosELancamentosCompostos[l.pessoa_id]) {
      sociosELancamentosCompostos[l.pessoa_id].lancamento_composto_id =
        l.lancamento_composto_id;
      sociosELancamentosCompostos[l.pessoa_id].lancamento_id = l.id;
    }
  });
  return sociosELancamentosCompostos;
}
exports.unirSociosELancamentosCompostos = unirSociosELancamentosCompostos;
