import "server-only";

const BASE_URL = "https://api.wire.mn/v1";

export async function wireRequest<T>(
  path: string,
  options: {
    method?: "GET" | "POST";
    body?: unknown;
    idempotencyKey?: string;
  } = {},
): Promise<T> {
  const key = process.env.WIRE_API_KEY;
  if (!key) throw new Error("WIRE_API_KEY missing");

  const response = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(options.idempotencyKey
        ? { "Idempotency-Key": options.idempotencyKey }
        : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);

    const errorCode =
      typeof body?.error?.code === "string" ? body.error.code : "unknown_error";

    console.error("WIRE CHECKOUT ERROR:", {
      endpoint: path,
      status: response.status,
      code: errorCode,
      requestId: body?.error?.request_id ?? null,
    });

    throw new Error(`Wire API ${response.status}: ${errorCode}`);
  }

  return response.json() as Promise<T>;
}
