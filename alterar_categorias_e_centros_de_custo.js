// ler lançamentos
// fazer um loop por cada lançamento
// para o centro de custo
// verificar se está na list de-para
// se estiver, alterar e atualizar o lançamento
// para a categoria
// verificar se está na list de-para
// se estiver, alterar e atualizar o lançamento
// const axios = require('axios');
const { ler_lancamentos } = require("./lib/ler_lancamentos");
const {
  ler_centros_de_custo_agrupados,
} = require("./lib/ler_centros_de_custo_agrupados");
const { ler_categorias_agrupadas } = require("./lib/ler_categorias_agrupadas");
const {
  mapear_categoria,
} = require("./alterar_categorias_e_centros_de_custo/mapear_categoria");
// const {
//   recupera_id_composto,
// } = require("./alterar_categorias_e_centros_de_custo/baseIdCompostoFev24");
const {
  alterar_lancamento,
} = require("./alterar_categorias_e_centros_de_custo/alterar_lancamento");
const {
  agruparPorLancamentoComposto,
} = require("./alterar_categorias_e_centros_de_custo/agruparPorLancamentoComposto");
const {
  pedirAccessTokenSeNaoDefinido,
} = require("./pedirAccessTokenSeNaoDefinido");

const { mostrarLancamentos } = require("./lib/mostrarLancamentos");

function ordenarPorId(lancamentos) {
  lancamentos.sort((a, b) => a.id - b.id);
}

async function main(accessToken) {
  const centrosDeCusto = await ler_centros_de_custo_agrupados(accessToken);
  const categorias = await ler_categorias_agrupadas(accessToken);
  for (let chave = 1; chave <= 2; chave++) {
    const filtro = {
      limit: 50,
      lancamento_composto_id: 3343459,
      data_inicio: "2024-04-1",
      data_fim: "2024-04-30",
      tipo: "R|LR|RA",
      conta_id: 75063,
    };

    const lancamentos = await ler_lancamentos(accessToken, filtro);
    console.log(`Lidos: ${lancamentos.length} lançamentos`);

    const lancamentosCompostos = agruparPorLancamentoComposto(lancamentos);

    Object.keys(lancamentosCompostos).forEach((lancamento_composto_id) => {
      const lancamentos = lancamentosCompostos[lancamento_composto_id];
      ordenarPorId(lancamentos);
      mostrarLancamentos(
        centrosDeCusto,
        categorias,
        lancamentos,
        "antes de alterar"
      );
      const primeiroLancamento = lancamentos.shift();
      console.log(
        `Lançamento Composto ${lancamento_composto_id} \n Primeiro item: ${primeiroLancamento.descricao}`
      );

      const itemPrincipal = {
        categoria_id: parseInt(
          mapear_categoria(primeiroLancamento.categoria_id)
        ),
        data_vencimento: primeiroLancamento.data_vencimento,
      };

      const itensAdicionais = lancamentos.map((lancamento) => ({
        id: lancamento.id,
        categoria_id: parseInt(mapear_categoria(lancamento.categoria_id)),
      }));

      const dadosAlteracao = {
        ...itemPrincipal,
        itens_adicionais: itensAdicionais,
      };
      console.log([itemPrincipal, ...itensAdicionais]);
      console.log({ dadosAlteracao });

      // alterar_lancamento(accessToken, primeiroLancamento.id, dadosAlteracao);
    });
  }
}

pedirAccessTokenSeNaoDefinido(main);
