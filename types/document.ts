export interface Document {
  id: string;
  userId: string;
  filename: string;
  fileSize: number;
  fileType: string;
  pineconeIds: string[];
  chunkCount: number;
  metadata: {
    category?: string;
    tags?: string[];
    standards?: string[];
    software?: string[];
    [key: string]: any;
  };
  status: "processing" | "ready" | "failed";
  processingError?: string;
  createdAt: Date;
  updatedAt: Date;
}
