const _apiHost = "https://wallet.vaionex.com/v1/";

async function request(url, headersData, params = {}, method = "GET") {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      ...headersData
    },
  };

  if (params) {
    if (method === "POST") {
      options.body = JSON.stringify(params);
    }
  }

  const response = await fetch(_apiHost + url, options);
  const result = await response.json();

  if (response.ok) {
    return result;
  } else {
    const error = new Error();
    error.info = result;
    return error;
  }
}

function get(url, headersData, params) {
  return request(url, headersData, params);
}

function post(url, headersData, params) {
  return request(url, headersData, params, "POST");
}

export default {
  get,
  post,
};
