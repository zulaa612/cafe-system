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
    const details = await response.text();
    console.error("Wire API:", response.status, details);
    throw new Error(`Wire API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
