import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

let embeddingsInstance: GoogleGenerativeAIEmbeddings | null = null;

export function getEmbeddings(): GoogleGenerativeAIEmbeddings {
  if (!embeddingsInstance) {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY is not set in environment variables");
    }

    embeddingsInstance = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY,
      modelName: "text-embedding-004",
    });
  }

  return embeddingsInstance;
}

/**
 * Generate embeddings for a single text
 */
export async function embedText(text: string): Promise<number[]> {
  const embeddings = getEmbeddings();
  return await embeddings.embedQuery(text);
}

/**
 * Generate embeddings for multiple texts in batch
 */
export async function embedDocuments(texts: string[]): Promise<number[][]> {
  const embeddings = getEmbeddings();
  return await embeddings.embedDocuments(texts);
}
