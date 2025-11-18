import { StreamingTextResponse, GoogleGenerativeAIStream, Message } from "ai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { getOrCreateUser } from "@/lib/auth/clerk";
import { createMessage, createConversation, checkQueryLimit, incrementQueryUsage } from "@/lib/db/queries";
import { similaritySearch } from "@/lib/rag/retriever";
import { ENGINEERING_SYSTEM_PROMPT } from "@/lib/rag/prompts";

// Use Node.js runtime for LangChain and Pinecone compatibility
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages, conversationId } = await req.json();

    // Authenticate user
    const user = await getOrCreateUser();

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
      apiKey: process.env.GOOGLE_API_KEY!,
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
