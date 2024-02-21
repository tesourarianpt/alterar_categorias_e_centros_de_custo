const axios = require("axios");

const apiUrl = "https://api.granatum.com.br/v1/lancamentos";

function lerLancamento(accessToken, lancamentoId) {
  const params = {
    access_token: accessToken,
  };

  return axios
    .get(`${apiUrl}/${lancamentoId}`, {
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
exports.lerLancamento = lerLancamento;
