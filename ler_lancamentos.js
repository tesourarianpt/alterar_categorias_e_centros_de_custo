const axios = require("axios");

const apiUrl = "https://api.granatum.com.br/v1/lancamentos";

function ler_lancamentos(accessToken, filtro) {
  const params = {
    access_token: accessToken,
    limit: 21,
    data_inicio: "2024-01-01",
    data_fim: "2024-01-31",
    //    lancamento_composto_id: 3342580,
    tipo: "R|LR",
    conta_id: 75063,
  };

  return axios
    .get(apiUrl, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
}
exports.ler_lancamentos = ler_lancamentos;
