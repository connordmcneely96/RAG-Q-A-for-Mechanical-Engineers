/**
 * Pinecone REST helper (edge/Workers compatible).
 *
 * The official Pinecone JS SDK pulls in Node-only modules (fs/path/node:stream),
 * which breaks Cloudflare/edge builds. We use the HTTP API instead.
 */

let cachedHost: string | null = null;

export function getPineconeIndexName(): string {
  return process.env.PINECONE_INDEX_NAME || "mechassist-vectors";
}

export function getPineconeApiKey(): string {
  const key = process.env.PINECONE_API_KEY;
  if (!key) throw new Error("PINECONE_API_KEY is not set in environment variables");
  return key;
}

/**
 * Returns the data plane host for your Pinecone index.
 *
 * Recommended: set `PINECONE_HOST` directly in env.
 * Fallback: fetch it from the control plane.
 */
export async function getPineconeHost(): Promise<string> {
  const explicitHost = process.env.PINECONE_HOST;
  if (explicitHost) return explicitHost;
  if (cachedHost) return cachedHost;

  const indexName = getPineconeIndexName();
  const apiKey = getPineconeApiKey();

  const res = await fetch(`https://api.pinecone.io/indexes/${encodeURIComponent(indexName)}`, {
    headers: {
      "Api-Key": apiKey,
      "Accept": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to resolve Pinecone host (${res.status}): ${text || res.statusText}`);
  }

  const json: any = await res.json();
  const host = json?.host;
  if (!host) {
    throw new Error("Pinecone index host not found. Set PINECONE_HOST explicitly.");
  }

  cachedHost = host;
  return host;
}

export async function pineconeQuery(params: {
  vector: number[];
  topK: number;
  namespace?: string;
  filter?: Record<string, any>;
  includeMetadata?: boolean;
}) {
  const host = await getPineconeHost();
  const apiKey = getPineconeApiKey();

  const res = await fetch(`https://${host}/query`, {
    method: "POST",
    headers: {
      "Api-Key": apiKey,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      vector: params.vector,
      topK: params.topK,
      namespace: params.namespace,
      filter: params.filter,
      includeMetadata: params.includeMetadata ?? true,
      includeValues: false,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Pinecone query failed (${res.status}): ${text || res.statusText}`);
  }

  return (await res.json()) as any;
}

export async function pineconeUpsert(params: {
  vectors: Array<{ id: string; values: number[]; metadata?: Record<string, any> }>;
  namespace?: string;
}) {
  const host = await getPineconeHost();
  const apiKey = getPineconeApiKey();

  const res = await fetch(`https://${host}/vectors/upsert`, {
    method: "POST",
    headers: {
      "Api-Key": apiKey,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      namespace: params.namespace,
      vectors: params.vectors,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Pinecone upsert failed (${res.status}): ${text || res.statusText}`);
  }

  return (await res.json()) as any;
}
