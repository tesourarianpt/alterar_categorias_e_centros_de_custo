const axios = require("axios");
const querystring = require("querystring");

const apiUrl = "https://api.granatum.com.br/v1/lancamentos";

function jsonToFormUrlEncoded(json) {
  const params = new URLSearchParams();

  const flattenObject = (obj, prefix = "") => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const propName = prefix
          ? `${prefix}[${parseInt(key) == key ? "" : key}]`
          : key;

        if (typeof obj[key] === "object" && obj[key] !== null) {
          flattenObject(obj[key], propName);
        } else {
          params.append(propName, obj[key]);
        }
      }
    }
  };

  flattenObject(json);
  return params.toString();
}

function alterar_lancamento(accessToken, id, params) {
  const url = `${apiUrl}/${id}`;
  const serializedParams = jsonToFormUrlEncoded(params);

  return axios
    .put(url, serializedParams, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: { access_token: accessToken },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("ERRO", JSON.stringify(error));
      console.error("ERRO", JSON.stringify(error.response.data));
    });
}
exports.alterar_lancamento = alterar_lancamento;
