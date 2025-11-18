import { Pinecone } from "@pinecone-database/pinecone";

// Initialize Pinecone client as a singleton
let pineconeClient: Pinecone | null = null;

export function getPineconeClient(): Pinecone {
  if (!pineconeClient) {
    if (!process.env.PINECONE_API_KEY) {
      throw new Error("PINECONE_API_KEY is not set in environment variables");
    }

    pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
  }

  return pineconeClient;
}

export function getPineconeIndex() {
  const client = getPineconeClient();
  const indexName = process.env.PINECONE_INDEX_NAME || "mechassist-vectors";

  return client.index(indexName);
}

// Helper function to create index if it doesn't exist (for setup/initialization)
export async function initializePineconeIndex() {
  const client = getPineconeClient();
  const indexName = process.env.PINECONE_INDEX_NAME || "mechassist-vectors";

  try {
    // Check if index exists
    const indexes = await client.listIndexes();
    const indexExists = indexes.indexes?.some((index) => index.name === indexName);

    if (!indexExists) {
      console.log(`Creating Pinecone index: ${indexName}`);

      // Create index with proper configuration for embeddings
      await client.createIndex({
        name: indexName,
        dimension: 768, // Google text-embedding-004 dimension
        metric: "cosine",
        spec: {
          serverless: {
            cloud: "aws",
            region: process.env.PINECONE_ENVIRONMENT || "us-east-1",
          },
        },
      });

      console.log(`Pinecone index ${indexName} created successfully`);
    } else {
      console.log(`Pinecone index ${indexName} already exists`);
    }

    return true;
  } catch (error) {
    console.error("Error initializing Pinecone index:", error);
    throw error;
  }
}
