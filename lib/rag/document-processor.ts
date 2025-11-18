import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";

/**
 * Configuration for document processing
 */
export const CHUNK_CONFIG = {
  chunkSize: 1000,
  chunkOverlap: 200,
  separators: ["\n\n", "\n", ". ", " ", ""],
};

/**
 * Detect if text contains mathematical equations
 */
function detectEquations(text: string): boolean {
  // Look for common equation patterns: numbers with operators, formulas, units
  const equationPatterns = [
    /\d+\s*[+\-*/=]\s*\d+/,
    /[σεΔ∆∑∏∫]/,
    /\b(MPa|GPa|psi|ksi|N|kN|mm|cm|m)\b/,
  ];

  return equationPatterns.some(pattern => pattern.test(text));
}

/**
 * Detect if text contains tables
 */
function detectTables(text: string): boolean {
  // Look for table-like structures: multiple pipes or tabs
  const tablePatterns = [
    /\|.*\|.*\|/, // Markdown table
    /\t.*\t.*\t/, // Tab-separated
  ];

  return tablePatterns.some(pattern => pattern.test(text));
}

/**
 * Extract engineering topics from text
 */
function extractTopics(text: string): string[] {
  const topics: string[] = [];

  const topicKeywords: Record<string, RegExp[]> = {
    "Material Properties": [/material\s+propert/i, /tensile\s+strength/i, /yield\s+strength/i, /elastic\s+modulus/i],
    "GD&T": [/geometric\s+dimensioning/i, /gd&t/i, /tolerance/i, /datum/i],
    "CAD": [/solidworks/i, /fusion\s+360/i, /autocad/i, /catia/i, /inventor/i],
    "Manufacturing": [/cnc/i, /machining/i, /injection\s+molding/i, /3d\s+print/i],
    "Stress Analysis": [/stress/i, /strain/i, /fea/i, /finite\s+element/i],
    "Standards": [/asme/i, /iso\s+\d+/i, /din/i, /ansi/i],
  };

  for (const [topic, patterns] of Object.entries(topicKeywords)) {
    if (patterns.some(pattern => pattern.test(text))) {
      topics.push(topic);
    }
  }

  return topics;
}

/**
 * Process and chunk a document with engineering-aware splitting
 */
export async function processDocument(
  text: string,
  metadata: Record<string, any> = {}
): Promise<Document[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_CONFIG.chunkSize,
    chunkOverlap: CHUNK_CONFIG.chunkOverlap,
    separators: CHUNK_CONFIG.separators,
  });

  // Split the document
  const chunks = await splitter.createDocuments([text], [metadata]);

  // Enrich each chunk with engineering-specific metadata
  const enrichedChunks = chunks.map((chunk, index) => {
    const chunkText = chunk.pageContent;

    return new Document({
      pageContent: chunkText,
      metadata: {
        ...chunk.metadata,
        chunkIndex: index,
        containsEquations: detectEquations(chunkText),
        containsTables: detectTables(chunkText),
        engineeringTopics: extractTopics(chunkText),
        chunkLength: chunkText.length,
      },
    });
  });

  return enrichedChunks;
}

/**
 * Process PDF file (requires PDF parsing library)
 * This is a placeholder - in production, you'd use a library like pdf-parse
 */
export async function processPDF(
  fileBuffer: Buffer,
  metadata: Record<string, any> = {}
): Promise<Document[]> {
  // TODO: Implement actual PDF parsing
  // For now, throw an error to remind us to implement this
  throw new Error("PDF processing not yet implemented. Install pdf-parse or similar library.");

  // Example implementation would be:
  // const pdfParse = require('pdf-parse');
  // const data = await pdfParse(fileBuffer);
  // return await processDocument(data.text, metadata);
}

/**
 * Clean and normalize text before processing
 */
export function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, "\n") // Normalize line endings
    .replace(/\n{3,}/g, "\n\n") // Reduce multiple newlines
    .replace(/\s+/g, " ") // Normalize spaces
    .trim();
}
