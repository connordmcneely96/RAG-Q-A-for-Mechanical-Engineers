"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import { MessageBubble } from "./message-bubble";
import { ChatInput } from "./chat-input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

interface ChatInterfaceProps {
  conversationId?: string;
}

export function ChatInterface({ conversationId }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      api: "/api/chat",
      body: {
        conversationId,
      },
    });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4 max-w-md px-4">
              <h2 className="text-2xl font-bold text-foreground">
                Welcome to MechAssist AI
              </h2>
              <p className="text-muted-foreground">
                Ask me anything about mechanical engineering, CAD, materials,
                manufacturing, or design standards.
              </p>

              <div className="grid gap-2 mt-6">
                <p className="text-sm font-medium text-muted-foreground">
                  Try asking:
                </p>
                <Card className="p-3 text-sm text-left cursor-pointer hover:bg-muted transition-colors">
                  "What is the yield strength of 6061-T6 aluminum?"
                </Card>
                <Card className="p-3 text-sm text-left cursor-pointer hover:bg-muted transition-colors">
                  "How do I apply GD&T to a cylindrical feature?"
                </Card>
                <Card className="p-3 text-sm text-left cursor-pointer hover:bg-muted transition-colors">
                  "What's the difference between FEA and CFD?"
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={{
                  id: message.id,
                  role: message.role as "user" | "assistant",
                  content: message.content,
                  sources: [], // Will be populated from API
                  createdAt: new Date(),
                }}
              />
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 px-4">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">
                  Searching knowledge base and generating answer...
                </span>
              </div>
            )}

            {error && (
              <div className="px-4">
                <Card className="p-4 bg-destructive/10 border-destructive">
                  <p className="text-sm text-destructive">
                    Error: {error.message}
                  </p>
                </Card>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <Separator className="my-4" />

      {/* Input Area */}
      <div className="px-4 pb-4">
        <ChatInput
          onSend={(message) => {
            handleSubmit(new Event("submit") as any, {
              data: { message },
            });
          }}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
