import type { Metadata } from "next";
import { Inter, JetBrains_Mono, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: '--font-jetbrains-mono',
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: '--font-ibm-plex-mono',
});

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
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${ibmPlexMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
