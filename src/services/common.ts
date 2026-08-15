import { apiFetch } from "@/lib/http";

const toBody = <TReq>(body?: TReq) => {
  if (body === undefined) return undefined;
  if (body instanceof FormData) return body;

  return JSON.stringify(body);
};

export const apiGet = async <TRes>(
  path: string,
  query?: Record<string, any>
): Promise<TRes> => apiFetch<TRes>(path, { method: "GET", query });

export const apiPost = async <TRes, TReq>(
  path: string,
  body?: TReq
): Promise<TRes> =>
  apiFetch<TRes>(path, { method: "POST", body: toBody(body) });

export const apiPatch = async <TRes, TReq>(
  path: string,
  body?: TReq
): Promise<TRes> =>
  apiFetch<TRes>(path, { method: "PATCH", body: toBody(body) });

export const apiDelete = async <TRes>(path: string): Promise<TRes> =>
  apiFetch<TRes>(path, { method: "DELETE" });
