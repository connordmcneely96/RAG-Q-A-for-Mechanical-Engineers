import { StreamingTextResponse, GoogleGenerativeAIStream, Message } from "ai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { getOrCreateUser } from "@/lib/auth/clerk";
import { createMessage, createConversation, checkQueryLimit, incrementQueryUsage } from "@/lib/db/queries";
import { similaritySearch } from "@/lib/rag/retriever";
import { ENGINEERING_SYSTEM_PROMPT } from "@/lib/rag/prompts";
import { isPreviewMode } from "@/lib/preview";

// Use Node.js runtime for LangChain and Pinecone compatibility
export const dynamic = 'force-dynamic';
export const runtime = 'edge';
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages, conversationId } = await req.json();

    // Authenticate user
    const user = await getOrCreateUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Check query limit
    const hasQueries = await checkQueryLimit(user.id);
    if (!hasQueries) {
      return new Response("Query limit exceeded. Please upgrade your plan.", {
        status: 429,
      });
    }

    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== "user") {
      return new Response("Invalid message format", { status: 400 });
    }

    const userQuestion = lastMessage.content;

    // Preview mode: return a fast, deterministic mock answer (no external services).
    if (isPreviewMode() || !process.env.GOOGLE_API_KEY) {
      const encoder = new TextEncoder();

      const mockCompletion =
        `Preview mode answer (no external services).\n\n` +
        `You asked: ${userQuestion}\n\n` +
        `- Key points: (1) clarify assumptions, (2) show steps, (3) give practical guidance.\n` +
        `- Next step: ask one follow-up to lock inputs, then compute.\n\n` +
        `If you want live answers, configure Clerk + DB + GOOGLE_API_KEY + Pinecone in Cloudflare.`;

      // Create or get conversation
      let convId: string = conversationId as string;
      if (!convId) {
        const conv = await createConversation(user.id, userQuestion.slice(0, 100));
        convId = conv.id;
      }

      await createMessage({
        conversationId: convId,
        role: "user",
        content: userQuestion,
      });

      await createMessage({
        conversationId: convId,
        role: "assistant",
        content: mockCompletion,
        sources: [
          { content: "Preview citation: Example handbook excerpt…", metadata: { source: "preview" }, score: 0.92 },
          { content: "Preview citation: Example standard clause…", metadata: { source: "preview" }, score: 0.88 },
        ],
      });

      await incrementQueryUsage(user.id);

      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(encoder.encode(mockCompletion));
          controller.close();
        },
      });

      return new StreamingTextResponse(stream);
    }

    if (!process.env.PINECONE_API_KEY || !(process.env.PINECONE_HOST || process.env.PINECONE_INDEX_NAME)) {
      return new Response(
        "Server is missing Pinecone config (PINECONE_API_KEY and PINECONE_HOST recommended).",
        { status: 503 }
      );
    }

    // Retrieve relevant documents from Pinecone
    const relevantDocs = await similaritySearch(userQuestion, {
      k: 5,
    });

    // Format context from retrieved documents
    const context = relevantDocs
      .map((doc, idx) => {
        return `[Source ${idx + 1}] ${doc.content}\n(Relevance: ${(doc.relevanceScore * 100).toFixed(1)}%)`;
      })
      .join("\n\n");

    // Build the prompt with context
    const systemPrompt = `${ENGINEERING_SYSTEM_PROMPT}\n\nContext from knowledge base:\n${context}`;

    // Format messages for Gemini
    const formattedMessages = [
      { role: "user" as const, content: systemPrompt },
      ...messages.map((m: Message) => ({
        role: m.role === "user" ? ("user" as const) : ("assistant" as const),
        content: m.content,
      })),
    ];

    // Initialize Gemini model
    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      modelName: "gemini-2.0-flash-exp",
      temperature: 0.2,
      maxOutputTokens: 2048,
      streaming: true,
    });

    // Generate streaming response
    const response = await model.stream(formattedMessages);

    // Convert to ReadableStream for the AI SDK
    const stream = GoogleGenerativeAIStream(response as any, {
      async onFinal(completion: string) {
        try {
          // Create or get conversation
          let convId = conversationId;
          if (!convId) {
            const firstMessage = userQuestion.slice(0, 100);
            const conv = await createConversation(
              user.id,
              firstMessage
            );
            convId = conv.id;
          }

          // Save messages to database
          await createMessage({
            conversationId: convId,
            role: "user",
            content: userQuestion,
          });

          await createMessage({
            conversationId: convId,
            role: "assistant",
            content: completion,
            sources: relevantDocs.map((doc) => ({
              content: doc.content.slice(0, 200),
              metadata: doc.metadata,
              score: doc.relevanceScore,
            })),
          });

          // Increment query usage
          await incrementQueryUsage(user.id);
        } catch (error) {
          console.error("Error saving messages:", error);
        }
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return new Response(error.message || "Internal Server Error", {
      status: 500,
    });
  }
}
