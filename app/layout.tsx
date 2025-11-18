import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MechAssist AI - Intelligent Mechanical Engineering Assistant",
  description: "AI-powered RAG system providing instant answers to mechanical engineering, CAD, and manufacturing questions",
  keywords: ["mechanical engineering", "CAD", "AI assistant", "RAG", "engineering Q&A"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
