import { getPrisma } from "./client";
import { isPreviewMode } from "@/lib/preview";

type PreviewUser = {
  id: string;
  clerkId: string;
  email: string;
  name?: string | null;
  createdAt: Date;
  updatedAt: Date;
  subscription?: {
    userId: string;
    tier: string;
    status: string;
    queriesUsed: number;
    queriesLimit: number;
    periodStart: Date;
    periodEnd: Date;
  };
};

type PreviewConversation = {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
};

type PreviewMessage = {
  id: string;
  conversationId: string;
  role: string;
  content: string;
  sources?: any;
  tokenCount?: number;
  createdAt: Date;
};

type PreviewDocument = {
  id: string;
  userId: string;
  filename: string;
  fileSize: number;
  fileType: string;
  pineconeIds: string[];
  chunkCount: number;
  metadata: any;
  status: string;
  processingError?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type PreviewStore = {
  users: Record<string, PreviewUser>;
  conversations: PreviewConversation[];
  messages: PreviewMessage[];
  documents: PreviewDocument[];
};

function getPreviewStore(): PreviewStore {
  const g = globalThis as any;
  if (!g.__mechassistPreviewStore) {
    const now = new Date();
    const userId = "dev-user-id";
    g.__mechassistPreviewStore = {
      users: {
        "dev-clerk-id": {
          id: userId,
          clerkId: "dev-clerk-id",
          email: "demo@mechassist.ai",
          name: "Demo User",
          createdAt: now,
          updatedAt: now,
          subscription: {
            userId,
            tier: "free",
            status: "active",
            queriesUsed: 3,
            queriesLimit: 50,
            periodStart: now,
            periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
      conversations: [],
      messages: [],
      documents: [],
    } satisfies PreviewStore;
  }
  return g.__mechassistPreviewStore as PreviewStore;
}

/**
 * User queries
 */
export async function getUserByClerkId(clerkId: string) {
  if (isPreviewMode()) {
    const store = getPreviewStore();
    return store.users[clerkId] || null;
  }
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
  if (isPreviewMode()) {
    const store = getPreviewStore();
    const now = new Date();
    const userId = crypto.randomUUID();
    const user: PreviewUser = {
      id: userId,
      clerkId: data.clerkId,
      email: data.email,
      name: data.name,
      createdAt: now,
      updatedAt: now,
      subscription: {
        userId,
        tier: "free",
        status: "active",
        queriesUsed: 0,
        queriesLimit: 50,
        periodStart: now,
        periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    };
    store.users[data.clerkId] = user;
    return user as any;
  }
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
  if (isPreviewMode()) {
    const store = getPreviewStore();
    const conversations = store.conversations
      .filter((c) => c.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .map((c) => {
        const firstMessage = store.messages
          .filter((m) => m.conversationId === c.id)
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0];

        return {
          ...c,
          messages: firstMessage ? [firstMessage] : [],
        };
      });

    return conversations as any;
  }
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
  if (isPreviewMode()) {
    const store = getPreviewStore();
    const conv = store.conversations.find((c) => c.id === id);
    if (!conv) return null;
    const messages = store.messages
      .filter((m) => m.conversationId === id)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    return { ...conv, messages } as any;
  }
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
  if (isPreviewMode()) {
    const store = getPreviewStore();
    const now = new Date();
    const conv: PreviewConversation = {
      id: crypto.randomUUID(),
      userId,
      title,
      createdAt: now,
      updatedAt: now,
    };
    store.conversations.push(conv);
    return conv as any;
  }
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
  if (isPreviewMode()) {
    const store = getPreviewStore();
    const msg: PreviewMessage = {
      id: crypto.randomUUID(),
      conversationId: data.conversationId,
      role: data.role,
      content: data.content,
      sources: data.sources,
      tokenCount: data.tokenCount,
      createdAt: new Date(),
    };
    store.messages.push(msg);
    const conv = store.conversations.find((c) => c.id === data.conversationId);
    if (conv) conv.updatedAt = new Date();
    return msg as any;
  }
  const prisma = getPrisma();
  return await prisma.message.create({
    data,
  });
}

/**
 * Document queries
 */
export async function getDocumentsByUserId(userId: string) {
  if (isPreviewMode()) {
    const store = getPreviewStore();
    return store.documents
      .filter((d) => d.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) as any;
  }
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
  if (isPreviewMode()) {
    const store = getPreviewStore();
    const now = new Date();
    const doc: PreviewDocument = {
      id: crypto.randomUUID(),
      userId: data.userId,
      filename: data.filename,
      fileSize: data.fileSize,
      fileType: data.fileType,
      pineconeIds: data.pineconeIds,
      chunkCount: data.chunkCount,
      metadata: data.metadata,
      status: data.status,
      processingError: null,
      createdAt: now,
      updatedAt: now,
    };
    store.documents.push(doc);
    return doc as any;
  }
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
  if (isPreviewMode()) {
    const store = getPreviewStore();
    const doc = store.documents.find((d) => d.id === id);
    if (!doc) throw new Error("Document not found");
    doc.status = status;
    doc.processingError = error || null;
    doc.updatedAt = new Date();
    return doc as any;
  }
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
  if (isPreviewMode()) {
    const store = getPreviewStore();
    const doc = store.documents.find((d) => d.id === id);
    if (!doc) throw new Error("Document not found");
    if (data.pineconeIds) doc.pineconeIds = data.pineconeIds;
    if (typeof data.chunkCount === "number") doc.chunkCount = data.chunkCount;
    if (data.metadata) doc.metadata = data.metadata;
    if (data.status) doc.status = data.status;
    if (typeof data.processingError !== "undefined") doc.processingError = data.processingError;
    doc.updatedAt = new Date();
    return doc as any;
  }
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
  if (isPreviewMode()) {
    // Keep it simple for preview mode: accept and return payload.
    return {
      id: crypto.randomUUID(),
      userId: data.userId,
      messageId: data.messageId,
      helpful: data.helpful,
      comment: data.comment || null,
      createdAt: new Date(),
    } as any;
  }
  const prisma = getPrisma();
  return await prisma.feedback.create({
    data,
  });
}

/**
 * Subscription queries
 */
export async function incrementQueryUsage(userId: string) {
  if (isPreviewMode()) {
    const store = getPreviewStore();
    const user = Object.values(store.users).find((u) => u.id === userId);
    if (!user?.subscription) throw new Error("User or subscription not found");
    user.subscription.queriesUsed += 1;
    return user.subscription as any;
  }
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
  if (isPreviewMode()) {
    const store = getPreviewStore();
    const user = Object.values(store.users).find((u) => u.id === userId);
    if (!user?.subscription) return true;
    return user.subscription.queriesUsed < user.subscription.queriesLimit;
  }
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
