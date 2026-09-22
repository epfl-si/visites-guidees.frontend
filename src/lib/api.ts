import { env } from "./env";
import type { BackendResponse } from "@/types/api";

let globalAccessToken: string | null = null;

export function setGlobalAccessToken(token: string | null) {
  globalAccessToken = token;
};

<<<<<<< HEAD
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
};
=======
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}
>>>>>>> f90484c ([fix] Match the backend's guide endpoints)

interface ApiCallOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: HeadersInit;
  body?: unknown;
}

export async function call<T>(url: string, options: ApiCallOptions = {}): Promise<T> {
  const method = options.method ?? 'GET';
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }
  if (!headers.has('Authorization') && globalAccessToken) {
    headers.set('Authorization', `Bearer ${globalAccessToken}`);
  }

  const fetchOptions: RequestInit = { method, headers };

  if (options.body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, fetchOptions);

  return (await response.json()) as T;
}

const BACKEND_URL = env().GUIDED_TOURS_BACKEND_URL || 'http://localhost:3000/';

export async function callBackend<T>(
  endpoint: string,
  options: ApiCallOptions = {},
): Promise<BackendResponse<T>> {
  const data = await call<BackendResponse<T>>(`${BACKEND_URL}${endpoint}`, options);

  if (!data.success && data.code === 401) {
    onUnauthorized?.();
  }

  return data;
}
