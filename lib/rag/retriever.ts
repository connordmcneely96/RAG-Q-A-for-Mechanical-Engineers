import { embedDocuments, embedText } from "./embeddings";
import { pineconeQuery, pineconeUpsert } from "./pinecone-client";

export interface RetrievalOptions {
  k?: number; // Number of documents to retrieve
  filter?: Record<string, any>; // Metadata filters
  namespace?: string; // Pinecone namespace
}

/**
 * Perform a similarity search with metadata filtering
 */
export async function similaritySearch(
  query: string,
  options: RetrievalOptions = {}
) {
  const { k = 5, filter = {}, namespace = "engineering-docs" } = options;

  const vector = await embedText(query);
  const result = await pineconeQuery({
    vector,
    topK: k,
    namespace,
    filter,
    includeMetadata: true,
  });

  const matches: any[] = result?.matches || [];

  return matches.map((m) => ({
    content: m?.metadata?.text || "",
    metadata: m?.metadata || {},
    relevanceScore: m?.score ?? 0,
  }));
}

/**
 * Add documents to the vector store
 */
export async function addDocumentsToVectorStore(
  documents: Array<{ pageContent: string; metadata: Record<string, any> }>,
  namespace: string = "engineering-docs"
) {
  const texts = documents.map((d) => d.pageContent);
  const vectors = await embedDocuments(texts);

  const ids = documents.map(() => crypto.randomUUID());

  const upsertVectors = ids.map((id, i) => ({
    id,
    values: vectors[i],
    metadata: {
      // Stored under `text` so retrieval can return content without another fetch.
      text: documents[i].pageContent,
      ...documents[i].metadata,
    },
  }));

  await pineconeUpsert({
    namespace,
    vectors: upsertVectors,
  });

  return ids;
}
