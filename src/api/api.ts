const API_URL = process.env.EXPO_PUBLIC_API_URL as string;

if (!API_URL) {
  console.error(
    "ERROR: EXPO_PUBLIC_API_URL no está definida. Asegúrate de tener un archivo .env con EXPO_PUBLIC_API_URL="
  );
}

type RequestOptions = {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
};

async function request(endpoint: string, options: RequestOptions = {}) {
  try {
    const url = `${API_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

    const res = await fetch(url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API error ${res.status}: ${errorText}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Error en request:", err);
    throw err;
  }
}

export const api = {
  get: (endpoint: string) => request(endpoint),
  post: (endpoint: string, body: any) =>
    request(endpoint, { method: "POST", body }),
  put: (endpoint: string, body: any) =>
    request(endpoint, { method: "PUT", body }),
  delete: (endpoint: string) =>
    request(endpoint, { method: "DELETE" }),
};
