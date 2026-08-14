export class ApiError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(status: number, message: string, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function resolveUrl(path: string, query?: QueryParams) {
  const base =
    typeof window === "undefined"
      ? (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000")
      : "";

  const search = query ? buildSearchParams(query) : "";

  return `${base}${path}${search}`;
}

export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined | Array<string | number>
>;

function buildSearchParams(query: QueryParams) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;

    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, String(item)));
    } else {
      params.set(key, String(value));
    }
  }

  const search = params.toString();

  return search ? `?${search}` : "";
}

export async function apiFetch<TResponse>(
  path: string,
  init: RequestInit & { query?: QueryParams } = {}
): Promise<TResponse> {
  const { query, headers, ...rest } = init;

  const isFormData = rest.body instanceof FormData;

  const response = await fetch(resolveUrl(path, query), {
    ...rest,
    headers: {
      Accept: "application/json",
      ...(rest.body && !isFormData
        ? { "Content-Type": "application/json" }
        : {}),
      ...headers,
    },
  });

  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      (isJson && typeof payload === "object" && payload !== null
        ? ((payload as { error?: string; message?: string }).error ??
          (payload as { message?: string }).message)
        : undefined) ?? `Request failed with status ${response.status}`;

    throw new ApiError(response.status, message, payload);
  }

  return payload as TResponse;
}
