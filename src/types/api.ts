export type BackendResponseSuccess<T> = {
  success: true;
  data: T;
  timestamp: string;
  requestId: string;
};

export type BackendResponseError = {
  success: false;
  message: string[];
  error: string;
  code: number;
  timestamp: string;
  requestId: string;
};

export type BackendResponse<T> = BackendResponseSuccess<T> | BackendResponseError;
