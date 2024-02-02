const axios = require("axios");

const apiUrl = "https://api.granatum.com.br/v1/lancamentos";

function ler_lancamentos(accessToken, filtro) {
  const params = {
    access_token: accessToken,
    ...filtro,
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
