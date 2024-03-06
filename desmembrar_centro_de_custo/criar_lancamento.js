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
  console.log({ params });
  return params.toString();
}

function criar_lancamento(accessToken, params) {
  const url = `${apiUrl}`;
  const serializedParams = jsonToFormUrlEncoded(params);

  return axios
    .post(url, serializedParams, {
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
exports.criar_lancamento = criar_lancamento;
