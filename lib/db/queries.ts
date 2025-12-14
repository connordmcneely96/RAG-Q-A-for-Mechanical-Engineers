import { getPrisma } from "./client";

/**
 * User queries
 */
export async function getUserByClerkId(clerkId: string) {
  const prisma = getPrisma();
  return await prisma.user.findUnique({
    where: { clerkId },
    include: {
      subscription: true,
    },
  });
}

export async function createUser(data: {
  clerkId: string;
  email: string;
  name?: string;
}) {
  const prisma = getPrisma();
  return await prisma.user.create({
    data: {
      ...data,
      subscription: {
        create: {
          tier: "free",
          status: "active",
          queriesLimit: 50,
          queriesUsed: 0,
          periodStart: new Date(),
          periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      },
    },
    include: {
      subscription: true,
    },
  });
}

/**
 * Conversation queries
 */
export async function getConversationsByUserId(userId: string) {
  const prisma = getPrisma();
  return await prisma.conversation.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        take: 1, // Just get the first message for preview
      },
    },
  });
}

export async function getConversationById(id: string) {
  const prisma = getPrisma();
  return await prisma.conversation.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function createConversation(userId: string, title: string) {
  const prisma = getPrisma();
  return await prisma.conversation.create({
    data: {
      userId,
      title,
    },
  });
}

/**
 * Message queries
 */
export async function createMessage(data: {
  conversationId: string;
  role: string;
  content: string;
  sources?: any;
  tokenCount?: number;
}) {
  const prisma = getPrisma();
  return await prisma.message.create({
    data,
  });
}

/**
 * Document queries
 */
export async function getDocumentsByUserId(userId: string) {
  const prisma = getPrisma();
  return await prisma.document.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createDocument(data: {
  userId: string;
  filename: string;
  fileSize: number;
  fileType: string;
  pineconeIds: string[];
  chunkCount: number;
  metadata: any;
  status: string;
}) {
  const prisma = getPrisma();
  return await prisma.document.create({
    data,
  });
}

export async function updateDocumentStatus(
  id: string,
  status: string,
  error?: string
) {
  const prisma = getPrisma();
  return await prisma.document.update({
    where: { id },
    data: {
      status,
      processingError: error,
    },
  });
}

export async function updateDocument(id: string, data: {
  pineconeIds?: string[];
  chunkCount?: number;
  metadata?: any;
  status?: string;
  processingError?: string | null;
}) {
  const prisma = getPrisma();
  return await prisma.document.update({
    where: { id },
    data,
  });
}

/**
 * Feedback queries
 */
export async function createFeedback(data: {
  userId: string;
  messageId: string;
  helpful: boolean;
  comment?: string;
}) {
  const prisma = getPrisma();
  return await prisma.feedback.create({
    data,
  });
}

/**
 * Subscription queries
 */
export async function incrementQueryUsage(userId: string) {
  const prisma = getPrisma();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  if (!user || !user.subscription) {
    throw new Error("User or subscription not found");
  }

  return await prisma.subscription.update({
    where: { userId },
    data: {
      queriesUsed: user.subscription.queriesUsed + 1,
    },
  });
}

export async function checkQueryLimit(userId: string): Promise<boolean> {
  const prisma = getPrisma();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  if (!user || !user.subscription) {
    return false;
  }

  return user.subscription.queriesUsed < user.subscription.queriesLimit;
}
