import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createRetriever } from "./retriever";
import { ENGINEERING_SYSTEM_PROMPT } from "./prompts";

export interface RAGChainOptions {
  temperature?: number;
  maxOutputTokens?: number;
  retrievalK?: number;
  filter?: Record<string, any>;
}

/**
 * Create the main RAG chain for engineering queries
 */
export async function createEngineeringRAGChain(options: RAGChainOptions = {}) {
  const {
    temperature = 0.2, // Lower temperature for more factual responses
    maxOutputTokens = 2048,
    retrievalK = 5,
    filter = {},
  } = options;

  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is not set in environment variables");
  }

  // Initialize Gemini model
  const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    modelName: "gemini-2.0-flash-exp",
    temperature,
    maxOutputTokens,
  });

  // Create retriever
  const retriever = await createRetriever({
    k: retrievalK,
    filter,
  });

  // Create the prompt template
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", ENGINEERING_SYSTEM_PROMPT],
    ["system", "Context from knowledge base:\n{context}"],
    ["human", "{input}"],
  ]);

  // Create the document combination chain
  const combineDocsChain = await createStuffDocumentsChain({
    llm: model,
    prompt,
  });

  // Create the final retrieval chain
  const chain = await createRetrievalChain({
    retriever,
    combineDocsChain,
  });

  return chain;
}

/**
 * Create a streaming RAG chain
 */
export async function createStreamingRAGChain(options: RAGChainOptions = {}) {
  const {
    temperature = 0.2,
    maxOutputTokens = 2048,
    retrievalK = 5,
    filter = {},
  } = options;

  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is not set in environment variables");
  }

  // Initialize Gemini model with streaming enabled
  const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    modelName: "gemini-2.0-flash-exp",
    temperature,
    maxOutputTokens,
    streaming: true,
  });

  // Create retriever
  const retriever = await createRetriever({
    k: retrievalK,
    filter,
  });

  // Create the prompt template
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", ENGINEERING_SYSTEM_PROMPT],
    ["system", "Context from knowledge base:\n{context}"],
    ["human", "{input}"],
  ]);

  // Create the document combination chain
  const combineDocsChain = await createStuffDocumentsChain({
    llm: model,
    prompt,
  });

  // Create the final retrieval chain
  const chain = await createRetrievalChain({
    retriever,
    combineDocsChain,
  });

  return chain;
}

/**
 * Simple function to ask a question using the RAG system
 */
export async function askQuestion(
  question: string,
  options: RAGChainOptions = {}
) {
  const chain = await createEngineeringRAGChain(options);

  const response = await chain.invoke({
    input: question,
  });

  return {
    answer: response.answer,
    sources: response.context,
  };
}
