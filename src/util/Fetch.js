const _apiHost = "https://wallet.vaionex.com/v1/";

async function request(url, headersData, params = {}, method = "GET") {
  const options = {
    method,
    headers: headersData,
  };

  if (params) {
    if (method === "POST") {
      options.body = JSON.stringify(params);
    }
  }

  const response = await fetch(_apiHost + url, options);

  if (response.status !== 200) {
    return generateErrorResponse(
      "The server responded with an unexpected status."
    );
  }

  const result = await response.json();

  return result;
}

function generateErrorResponse(message) {
  return {
    status: "error",
    message,
  };
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
