const BASE_URL = "http://localhost:8000/api/v1";

async function request(method, path, body = undefined) {
  const endpoint = path.startsWith("/") ? path : `/${path}`;
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.mensagem || data.message || data.erro || "Erro na requisição");
    error.response = { status: response.status, data };
    throw error;
  }

  return { data, status: response.status };
}

const api = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  put: (path, body) => request("PUT", path, body),
  patch: (path, body) => request("PATCH", path, body),
  delete: (path) => request("DELETE", path),
};

export default api;
