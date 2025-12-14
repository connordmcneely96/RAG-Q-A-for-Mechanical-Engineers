"use client";

import { useMemo, useRef, FormEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  placeholder = "Ask a mechanical engineering question...",
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSend = useMemo(() => value.trim().length > 0 && !isLoading, [value, isLoading]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSend) return;

    onSubmit();

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    target.style.height = "auto";
    target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder={placeholder}
        disabled={isLoading}
        className={cn(
          "min-h-[60px] max-h-[200px] pr-12 resize-none",
          "focus-visible:ring-2 focus-visible:ring-primary"
        )}
        rows={1}
      />

      <Button
        type="submit"
        size="icon"
        disabled={!canSend}
        className="absolute right-2 bottom-2"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </Button>
    </form>
  );
}
