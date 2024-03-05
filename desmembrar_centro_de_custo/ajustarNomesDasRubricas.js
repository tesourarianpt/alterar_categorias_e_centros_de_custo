const { countNumFundosParticipacao } = require("./countNumFundosParticipacao");
const temGranatum = (d) => d.includes("Granatum");
const temBoleto = (d) => d.includes("boleto");
const removerDepoisHifen = (d) => (temGranatum(d) ? d : d.split("-")[0].trim());
const nomeDepoisHifen = (d) => d.split("-")[1].trim();

const primeirasMaiusculas = (s) =>
  s
    .split(" ")
    .map((palavra) => {
      return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
    })
    .join(" ");

const nomesAntigosRubricas = [
  "Fundo Beneficente",
  "Fundo Ambiental",
  "Fundo de Participação",
  "Fundo de Saúde",
  "Fundo Regional",
  "Taxa de Preparo",
  "Taxa de Alimentação",
  "Mensalidade",
  "Taxa de Plantio",
  "Casa da União",
  "Novo Encanto",
  "Taxa de Boleto",
];

const adicionarHifen = (descricao) => {
  let ret = descricao.replace(
    new RegExp("fundo beneficiente", "gi"),
    "Fundo Beneficente"
  );

  nomesAntigosRubricas.forEach((nome) => {
    if (ret.toLowerCase().includes(nome.toLowerCase()) && !ret.includes("-")) {
      ret = ret.replace(new RegExp(nome, "gi"), `${nome} -`);
    }
  });
  return ret;
};

function ajustarNomesDasRubricas(lancamentos, nome) {
  const numSocios = countNumFundosParticipacao(lancamentos);
  console.log("ajustarNomesDasRubricas", nome);
  if (numSocios > 1) {
    return lancamentos.map((l) => {
      let novoNome = "";
      let numHifens = (l.descricao.match(/-/g) || []).length;

      if (
        (temGranatum(l.descricao) && numHifens === 1) ||
        (temBoleto(l.descricao) && numHifens === 0)
      ) {
        novoNome = `${l.descricao} - ${nome}`;
      } else {
        novoNome = l.descricao;
      }

      if (!temBoleto(l.descricao) && !temGranatum(l.descricao)) {
        const nomeRubrica = removerDepoisHifen(adicionarHifen(l.descricao));
        const nomeDepoisDoHifen = nomeDepoisHifen(adicionarHifen(l.descricao));
        const nomePessoa = primeirasMaiusculas(nomeDepoisDoHifen);
        novoNome = `${nomeRubrica} - ${nomePessoa}`;
      }

      console.log({ d: l.descricao, novoNome });

      return {
        ...l,
        descricao: novoNome,
      };
    });
  } else {
    return lancamentos.map((l) => {
      const novoNome = `${removerDepoisHifen(
        adicionarHifen(l.descricao)
      )} - ${nome}`;
      return {
        ...l,
        descricao: novoNome,
      };
    });
  }
}
exports.ajustarNomesDasRubricas = ajustarNomesDasRubricas;
