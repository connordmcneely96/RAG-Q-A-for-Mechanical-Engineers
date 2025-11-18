# 🔧 MechAssist AI - Intelligent Mechanical Engineering Assistant

> AI-powered RAG system providing instant answers to mechanical engineering, CAD, and manufacturing questions

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![LangChain](https://img.shields.io/badge/LangChain-Latest-green)](https://www.langchain.com/)
[![Gemini](https://img.shields.io/badge/Google-Gemini%202.0-red)](https://ai.google.dev/)
[![Pinecone](https://img.shields.io/badge/Pinecone-Vector%20DB-purple)](https://www.pinecone.io/)

## 🎯 Problem & Solution

**Problem:** Mechanical engineers spend hours searching through standards, textbooks, and documentation to find answers to technical questions.

**Solution:** MechAssist AI is an intelligent Q&A system with RAG (Retrieval Augmented Generation) that provides instant, accurate, and sourced answers to engineering questions.

## ✨ Key Features

- 🤖 **Advanced RAG Pipeline** - LangChain + Google Gemini 2.0 Flash for intelligent retrieval and generation
- 📚 **Pre-loaded Knowledge Base** - ASME, ISO standards, materials database, CAD best practices
- 🔍 **Semantic Search** - Pinecone vector database with source attribution and relevance scoring
- 📄 **Document Upload** - Process and search your own technical PDFs
- 💬 **Conversational Interface** - Context-aware chat with conversation history
- 🧮 **LaTeX Rendering** - Beautiful equation display using KaTeX
- 💻 **Syntax Highlighting** - Code blocks with proper language support
- 📊 **Usage Analytics** - Track queries, view history, and monitor limits
- 🎨 **Engineering-Focused UI** - Professional design with blueprint-inspired theme

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Animations:** Framer Motion
- **Markdown:** react-markdown with KaTeX support
- **Code Highlighting:** react-syntax-highlighter

### Backend & AI
- **RAG Framework:** LangChain
- **LLM:** Google Gemini 2.0 Flash (via @langchain/google-genai)
- **Embeddings:** Google text-embedding-004
- **Vector Database:** Pinecone
- **Streaming:** Vercel AI SDK

### Database & Auth
- **Database:** PostgreSQL (via Supabase)
- **ORM:** Prisma
- **Authentication:** Clerk
- **Session Management:** Clerk + Next.js middleware

### Deployment
- **Hosting:** Vercel
- **Vector Storage:** Pinecone Cloud
- **Database:** Supabase
- **Edge Functions:** Vercel Edge Runtime

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Interface                       │
│  Next.js 14 + TypeScript + Tailwind + shadcn/ui            │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                    API Routes (Edge)                         │
│  /api/chat - Streaming RAG responses                        │
│  /api/documents - Upload & process PDFs                     │
│  /api/conversations - Manage chat history                   │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  RAG Pipeline (LangChain)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Document   │  │  Embeddings  │  │   Retriever  │     │
│  │  Processing  │─>│  Generation  │─>│   (Pinecone) │     │
│  └──────────────┘  └──────────────┘  └──────┬───────┘     │
│                                               │              │
│  ┌──────────────────────────────────────────▼───────┐     │
│  │     Google Gemini 2.0 Flash (Generation)        │     │
│  └──────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                    Data Layer                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  PostgreSQL  │  │   Pinecone   │  │    Clerk     │     │
│  │   (Prisma)   │  │ Vector Store │  │     Auth     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Supabase recommended)
- Google Gemini API key
- Pinecone account and API key
- Clerk account for authentication

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/mechassist-ai.git
cd mechassist-ai
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database (Supabase)
DATABASE_URL=postgresql://user:password@host:5432/database

# Google Gemini API
GOOGLE_API_KEY=AIzaSy...

# Pinecone Vector Database
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=us-east-1
PINECONE_INDEX_NAME=mechassist-vectors

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

4. **Set up the database**

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

5. **Initialize Pinecone index**

Create a Pinecone index with the following settings:
- **Dimension:** 768 (for text-embedding-004)
- **Metric:** Cosine
- **Cloud:** AWS
- **Region:** us-east-1 (or your preferred region)

6. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
mechassist-ai/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (marketing)/         # Public landing pages
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── (app)/               # Protected app pages
│   │   ├── layout.tsx
│   │   ├── chat/            # Main chat interface
│   │   ├── knowledge/       # Document management
│   │   └── dashboard/       # User dashboard
│   ├── api/                 # API routes
│   │   ├── chat/            # Chat endpoint
│   │   ├── conversations/   # Conversation management
│   │   ├── documents/       # Document processing
│   │   ├── feedback/        # User feedback
│   │   └── webhooks/        # Clerk webhooks
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── chat/                # Chat-specific components
│   │   ├── chat-interface.tsx
│   │   ├── message-bubble.tsx
│   │   ├── source-card.tsx
│   │   ├── markdown-renderer.tsx
│   │   └── chat-input.tsx
│   └── layouts/             # Layout components
│       └── header.tsx
├── lib/
│   ├── rag/                 # RAG system core
│   │   ├── chain.ts         # Main RAG chain
│   │   ├── embeddings.ts    # Embedding generation
│   │   ├── retriever.ts     # Pinecone retrieval
│   │   ├── prompts.ts       # Prompt templates
│   │   ├── document-processor.ts
│   │   └── pinecone-client.ts
│   ├── db/                  # Database layer
│   │   ├── client.ts
│   │   └── queries.ts
│   ├── auth/                # Auth utilities
│   │   └── clerk.ts
│   └── utils.ts
├── prisma/
│   └── schema.prisma        # Database schema
├── types/
│   ├── chat.ts
│   └── document.ts
├── middleware.ts            # Clerk middleware
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🎨 Key Components

### RAG Pipeline

The RAG system is implemented in `lib/rag/`:

1. **Document Processing** (`document-processor.ts`)
   - Chunking with overlap for context preservation
   - Engineering-aware metadata extraction
   - Equation and table detection

2. **Embeddings** (`embeddings.ts`)
   - Google text-embedding-004 model
   - Batch processing for efficiency

3. **Retrieval** (`retriever.ts`)
   - Pinecone vector search
   - MMR (Maximum Marginal Relevance) for diversity
   - Metadata filtering by topic/standard/software

4. **Chain** (`chain.ts`)
   - LangChain retrieval chain
   - Streaming support via Vercel AI SDK
   - Engineering-specific prompts

### Chat Interface

The chat UI is built with:

- **MarkdownRenderer** - Renders markdown with LaTeX equations (KaTeX)
- **MessageBubble** - User/assistant message display
- **SourceCard** - Expandable citation cards
- **ChatInput** - Auto-resizing textarea with send button

## 📊 Database Schema

```prisma
model User {
  id            String          @id @default(cuid())
  clerkId       String          @unique
  email         String          @unique
  conversations Conversation[]
  documents     Document[]
  subscription  Subscription?
}

model Conversation {
  id       String    @id @default(cuid())
  userId   String
  title    String
  messages Message[]
}

model Message {
  id             String  @id @default(cuid())
  conversationId String
  role           String  // "user" | "assistant"
  content        String
  sources        Json?   // Retrieved documents with scores
}

model Document {
  id          String   @id @default(cuid())
  userId      String
  filename    String
  pineconeIds String[] // Vector IDs
  status      String   // "processing" | "ready" | "failed"
}

model Subscription {
  userId       String @unique
  tier         String // "free" | "pro" | "enterprise"
  queriesUsed  Int
  queriesLimit Int
}
```

## 🧪 Example Queries

MechAssist AI can answer questions like:

- "What is the yield strength of 6061-T6 aluminum?"
- "How do I apply GD&T to a cylindrical feature?"
- "Explain the difference between FEA and CFD analysis"
- "What are the design guidelines for injection molded parts?"
- "Calculate the stress in a cantilever beam with these dimensions..."
- "What's the difference between ASME Y14.5-2009 and Y14.5-2018?"

## 🎯 Roadmap

- [x] Core RAG system with Gemini + Pinecone
- [x] Chat interface with streaming
- [x] LaTeX equation rendering
- [x] Source citations
- [x] User authentication
- [x] Landing page
- [ ] Document upload and processing
- [ ] Conversation history sidebar
- [ ] Dashboard with analytics
- [ ] Feedback system
- [ ] Export conversations to PDF
- [ ] Advanced metadata filtering
- [ ] Multi-language support
- [ ] Mobile app

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini** for the powerful LLM
- **LangChain** for the RAG framework
- **Pinecone** for vector storage
- **Vercel** for hosting
- **shadcn/ui** for beautiful components
- **Clerk** for authentication

## 📧 Contact

For questions or feedback, please open an issue or reach out:

- **GitHub:** [@yourusername](https://github.com/yourusername)
- **LinkedIn:** [Your LinkedIn](https://linkedin.com/in/yourprofile)
- **Email:** your.email@example.com

---

Built with ❤️ for mechanical engineers worldwide.
