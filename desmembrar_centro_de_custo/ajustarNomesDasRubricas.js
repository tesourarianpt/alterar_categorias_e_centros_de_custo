const { centros_de_custo } = require("./centros_de_custo");
const { countNumFundosParticipacao } = require("./countNumFundosParticipacao");
const { rubricas } = require("./rubricas");
const temGranatum = (d) => d.includes("Granatum");
const temBoleto = (d) => d.includes("boleto");
const removerDepoisHifen = (d) => (temGranatum(d) ? d : d.split("-")[0].trim());
const nomeDepoisHifen = (d) => d.split("-")[1].trim();

const primeiraMaiuscula = (s) =>
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
const primeiroNome = (nome) => primeiraMaiuscula(nome.trim().split(" ")[0]);

const adicionarHifen = (descricao) => {
  let ret = descricao.replace(
    new RegExp("fundo beneficiente", "gi"),
    "Fundo Beneficente"
  );

  rubricas.forEach((rubrica) => {
    if (
      ret.toLowerCase().includes(rubrica.toLowerCase()) &&
      !ret.includes("-")
    ) {
      ret = ret.replace(new RegExp(rubrica, "gi"), `${rubrica} -`);
    }
  });
  return ret;
};

function ajustarNomesDasRubricas(lancamentos, nome) {
  const numSocios = countNumFundosParticipacao(lancamentos);

  if (numSocios > 1) {
    return lancamentos.map((l) => {
      return {
        ...l,
        descricao:
          temGranatum(l.descricao) || temBoleto(l.descricao)
            ? `${l.descricao} - ${primeiroNome(nome)}`
            : `${removerDepoisHifen(
                adicionarHifen(l.descricao)
              )} - ${primeiraMaiuscula(
                nomeDepoisHifen(adicionarHifen(l.descricao))
              )}`,
      };
    });
  } else {
    return lancamentos.map((l) => ({
      ...l,
      descricao: `${removerDepoisHifen(
        adicionarHifen(l.descricao)
      )} - ${primeiroNome(nome)}`,
    }));
  }
}
exports.ajustarNomesDasRubricas = ajustarNomesDasRubricas;
