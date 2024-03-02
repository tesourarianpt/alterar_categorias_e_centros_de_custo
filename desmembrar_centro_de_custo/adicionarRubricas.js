const { centros_de_custo } = require("./centros_de_custo");
const { countNumFundosParticipacao } = require("./countNumFundosParticipacao");

const temGranatum = (d) => d.includes("Granatum");
const temBoleto = (d) => d.includes("boleto");
const removerDepoisHifen = (d) => (temGranatum(d) ? d : d.split("-")[0].trim());
const nomeDepoisHifen = (d) => d.split("-")[1].trim();

const primeiraMaiuscula = (s) =>
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
const primeiroNome = (nome) => primeiraMaiuscula(nome.trim().split(" ")[0]);

const adicionarHifen = (d) => {
  let ret = d;
  [
    "Fundo Beneficente",
    "Fundo Beneficiente",
    "Mensalidade",
    "Taxa de Alimentação",
    "Taxa de Preparo",
    "Taxa de Plantio",
    "Casa da União",
    "Fundo Ambiental",
    "Fundo de Participação",
    "Fundo de Saúde",
    "Fundo Regional",
    "Novo Encanto",
    "Taxa de Boleto",
  ].forEach((rubrica) => {
    if (d.toLowerCase().includes(rubrica.toLowerCase()) && !d.includes("-")) {
      ret = d.replace(new RegExp(rubrica, "gi"), `${rubrica} -`);
    }
  });
  return ret;
};

function adicionarRubricas(lancamentos, nome) {
  const numSocios = countNumFundosParticipacao(lancamentos);
  console.log("adicionarRubricas");
  // mover os nomes das rubricas para um lugar comum (estão em ajustarNomesDasRubricas)
  // dividir por sócio
  // garantir que o sócio principal tem ( se não tiver, avisa e para )
  // - taxa de boleto
  // garantir que cada um tem
  // - 4 fundos da dg ( se não tiver, avisa e para )
  // - fundo regional ( se não tiver, avisa e para )
  // - preparo ( se não tiver, avisa e cria )
  // - alimentação ( se não tiver, avisa e cria )
  // - 4 items da mensalidade ( se não tiver, avisa e cria )
  // - plantio ( se não tiver, avisa e cria )
  // - novo encanto ( se não tiver, avisa e cria )
  // - casa da união ( se não tiver, avisa e cria )

  if (numSocios > 1) {
    console.log({ numSocios });
  } else {
    console.log("Um sócio");
  }
  return lancamentos;
}
exports.adicionarRubricas = adicionarRubricas;
