"use client";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Process LaTeX equations
  const processLatex = (text: string) => {
    // Split by display math ($$...$$) and inline math ($...$)
    const parts: JSX.Element[] = [];
    let currentIndex = 0;
    let key = 0;

    // Display math pattern
    const displayMathRegex = /\$\$([\s\S]+?)\$\$/g;
    // Inline math pattern
    const inlineMathRegex = /\$([^\$]+?)\$/g;

    let displayMatch;
    while ((displayMatch = displayMathRegex.exec(text)) !== null) {
      // Add text before the match
      if (displayMatch.index > currentIndex) {
        const textBefore = text.slice(currentIndex, displayMatch.index);
        parts.push(<span key={`text-${key++}`}>{textBefore}</span>);
      }

      // Add the display math
      parts.push(
        <BlockMath key={`display-${key++}`} math={displayMatch[1]} />
      );

      currentIndex = displayMatch.index + displayMatch[0].length;
    }

    // Process remaining text with inline math
    const remainingText = text.slice(currentIndex);
    let inlineIndex = 0;
    let inlineMatch;

    while ((inlineMatch = inlineMathRegex.exec(remainingText)) !== null) {
      // Add text before the match
      if (inlineMatch.index > inlineIndex) {
        const textBefore = remainingText.slice(inlineIndex, inlineMatch.index);
        parts.push(<span key={`text-${key++}`}>{textBefore}</span>);
      }

      // Add the inline math
      parts.push(
        <InlineMath key={`inline-${key++}`} math={inlineMatch[1]} />
      );

      inlineIndex = inlineMatch.index + inlineMatch[0].length;
    }

    // Add any remaining text
    if (inlineIndex < remainingText.length) {
      parts.push(
        <span key={`text-${key++}`}>{remainingText.slice(inlineIndex)}</span>
      );
    }

    return parts;
  };

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <ReactMarkdown
        components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || "");
          const codeString = String(children).replace(/\n$/, "");

          // Check if it contains LaTeX
          if (codeString.includes("$$") || codeString.includes("$")) {
            return <div>{processLatex(codeString)}</div>;
          }

          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus as any}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {codeString}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        p({ children }: any) {
          const text = String(children);
          if (text.includes("$$") || text.includes("$")) {
            return <div className="my-2">{processLatex(text)}</div>;
          }
          return <p>{children}</p>;
        },
        table({ children }: any) {
          return (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full divide-y divide-border">
                {children}
              </table>
            </div>
          );
        },
        th({ children }: any) {
          return (
            <th className="px-4 py-2 bg-muted text-left text-xs font-medium uppercase tracking-wider">
              {children}
            </th>
          );
        },
        td({ children }: any) {
          return <td className="px-4 py-2 border-t">{children}</td>;
        },
      }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
