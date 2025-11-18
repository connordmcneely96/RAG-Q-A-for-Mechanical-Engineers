import { PineconeStore } from "@langchain/pinecone";
import { getEmbeddings } from "./embeddings";
import { getPineconeIndex } from "./pinecone-client";

export interface RetrievalOptions {
  k?: number; // Number of documents to retrieve
  filter?: Record<string, any>; // Metadata filters
  namespace?: string; // Pinecone namespace
}

/**
 * Create a Pinecone vector store instance
 */
export async function createVectorStore(namespace: string = "engineering-docs") {
  const embeddings = getEmbeddings();
  const pineconeIndex = getPineconeIndex();

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    textKey: "text",
    namespace,
  });

  return vectorStore;
}

/**
 * Create a retriever with configurable options
 */
export async function createRetriever(options: RetrievalOptions = {}) {
  const {
    k = 5,
    filter = {},
    namespace = "engineering-docs",
  } = options;

  const vectorStore = await createVectorStore(namespace);

  // Create retriever with MMR (Maximum Marginal Relevance) for diversity
  const retriever = vectorStore.asRetriever({
    k,
    searchType: "mmr",
    searchKwargs: {
      fetchK: k * 4, // Fetch more candidates for MMR
      lambda: 0.5, // Balance between relevance and diversity
      filter,
    },
  });

  return retriever;
}

/**
 * Perform a similarity search with metadata filtering
 */
export async function similaritySearch(
  query: string,
  options: RetrievalOptions = {}
) {
  const { k = 5, filter = {}, namespace = "engineering-docs" } = options;

  const vectorStore = await createVectorStore(namespace);

  const results = await vectorStore.similaritySearchWithScore(query, k, filter);

  return results.map(([doc, score]) => ({
    content: doc.pageContent,
    metadata: doc.metadata,
    relevanceScore: score,
  }));
}

/**
 * Add documents to the vector store
 */
export async function addDocumentsToVectorStore(
  documents: Array<{ pageContent: string; metadata: Record<string, any> }>,
  namespace: string = "engineering-docs"
) {
  const embeddings = getEmbeddings();
  const pineconeIndex = getPineconeIndex();

  const ids = await PineconeStore.fromDocuments(documents, embeddings, {
    pineconeIndex,
    textKey: "text",
    namespace,
  });

  return ids;
}
