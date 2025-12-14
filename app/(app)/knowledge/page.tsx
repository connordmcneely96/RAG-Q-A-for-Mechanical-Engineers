"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Loader2, Upload } from "lucide-react";

export const dynamic = "force-dynamic";

type UserDocument = {
  id: string;
  filename: string;
  fileSize: number;
  fileType: string;
  chunkCount: number;
  status: string;
  processingError?: string | null;
  createdAt: string;
};

export default function KnowledgePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/documents", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to load documents");
      setDocuments(json.documents || []);
    } catch (e: any) {
      setError(e.message || "Failed to load documents");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function upload(file: File) {
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Upload failed");

      await refresh();
    } catch (e: any) {
      setError(e.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  const sortedDocuments = useMemo(() => {
    return [...documents].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [documents]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Knowledge Base</h1>

        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
              // allow re-selecting the same file
              e.currentTarget.value = "";
            }}
          />

          <Button
            className="gap-2"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            Upload PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Documents</CardTitle>
          <CardDescription>
            Upload and manage your engineering documents for AI-powered search
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-md border border-destructive bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center gap-2 py-8 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading documents…</span>
            </div>
          ) : documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No documents yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload PDFs (standards, textbooks, datasheets) to expand your knowledge base.
              </p>
              <Button
                variant="outline"
                className="gap-2"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4" />
                Upload Your First PDF
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-start justify-between gap-4 rounded-lg border p-4"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{doc.filename}</p>
                    <p className="text-sm text-muted-foreground">
                      {doc.chunkCount} chunks · {Math.round(doc.fileSize / 1024)} KB
                    </p>
                    {doc.status === "failed" && doc.processingError && (
                      <p className="mt-2 text-sm text-destructive">{doc.processingError}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={doc.status === "ready" ? "default" : "secondary"}>
                      {doc.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
