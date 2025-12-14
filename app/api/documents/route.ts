import { NextResponse } from "next/server";

import { getOrCreateUser } from "@/lib/auth/clerk";
import {
  createDocument,
  getDocumentsByUserId,
  updateDocument,
  updateDocumentStatus,
} from "@/lib/db/queries";
import { addDocumentsToVectorStore } from "@/lib/rag/retriever";
import { cleanText, processDocument } from "@/lib/rag/document-processor";

export const dynamic = "force-dynamic";
export const runtime = "edge";
export const maxDuration = 60;

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15MB

export async function GET() {
  try {
    const user = await getOrCreateUser();
    const documents = await getDocumentsByUserId(user.id);

    return NextResponse.json({ documents });
  } catch (error: any) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const user = await getOrCreateUser();

  // Create DB record early so we can show progress/failure.
  let documentId: string | null = null;

  try {
    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: "Server is missing GOOGLE_API_KEY. Configure it in Cloudflare Pages env vars." },
        { status: 503 }
      );
    }
    if (!process.env.PINECONE_API_KEY) {
      return NextResponse.json(
        { error: "Server is missing PINECONE_API_KEY. Configure it in Cloudflare Pages env vars." },
        { status: 503 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    // best-effort name/type
    const filename = (file as any).name || "document.pdf";
    const fileType = file.type || "application/pdf";

    if (fileType !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF uploads are supported" },
        { status: 400 }
      );
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: `File too large. Max ${MAX_UPLOAD_BYTES} bytes.` },
        { status: 413 }
      );
    }

    // Minimal metadata (extend later with tags/standards/software)
    const metadata = {
      category: formData.get("category") || "user-upload",
      tags: formData.get("tags") ? String(formData.get("tags")).split(",") : [],
    };

    const document = await createDocument({
      userId: user.id,
      filename,
      fileSize: file.size,
      fileType,
      pineconeIds: [],
      chunkCount: 0,
      metadata,
      status: "processing",
    });

    documentId = document.id;

    const arrayBuffer = await file.arrayBuffer();

    // `pdf-parse` expects a Node Buffer; `nodejs_compat` provides Buffer in Workers.
    if (typeof (globalThis as any).DOMMatrix === "undefined") {
      const dommatrix = await import("@thednp/dommatrix");
      (globalThis as any).DOMMatrix = (dommatrix as any).DOMMatrix;
    }

    const { PDFParse } = await import("pdf-parse");
    const parser = new (PDFParse as any)({ data: Buffer.from(arrayBuffer) } as any);
    const textResult: any = await parser.getText();
    const rawText: string =
      typeof textResult === "string" ? textResult : (textResult?.text as string) || "";

    const text = cleanText(rawText);
    if (!text) {
      throw new Error("No text could be extracted from the PDF");
    }

    // Namespace isolates user vectors from each other.
    const namespace = `user-${user.id}`;

    const chunks = await processDocument(text, {
      userId: user.id,
      documentId: document.id,
      filename,
      ...metadata,
    });

    const pineconeIds = await addDocumentsToVectorStore(
      chunks.map((c) => ({ pageContent: c.pageContent, metadata: c.metadata })),
      namespace
    );

    const updated = await updateDocument(document.id, {
      pineconeIds,
      chunkCount: chunks.length,
      metadata: {
        ...metadata,
        namespace,
      },
      status: "ready",
      processingError: null,
    });

    return NextResponse.json({ document: updated });
  } catch (error: any) {
    console.error("Error processing document:", error);

    if (documentId) {
      try {
        await updateDocumentStatus(documentId, "failed", error.message);
      } catch (e) {
        console.error("Error updating document status:", e);
      }
    }

    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
