import { env } from "./env";

let globalAccessToken: string | null = null;

export function setGlobalAccessToken(token: string | null) {
  globalAccessToken = token;
};

interface ApiCallOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: HeadersInit;
  body?: unknown;
}

const BASE_URL = env().VITE_GUIDED_TOURS_BACKEND_URL || 'http://localhost:3000/api/';

export async function apiCall<T>(
  endpoint: string,
  options: ApiCallOptions = {}
): Promise<T> {
  const method = options.method || 'GET';
  const headers = new Headers(options.headers);
  const url = `${BASE_URL}${endpoint}`

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  if (globalAccessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${globalAccessToken}`);
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  if (options.body && ['POST', 'PUT'].includes(method.toUpperCase())) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, fetchOptions);
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`Failed to fetch backend API: ${url} (${response.status})`);
  }
}
