"use client";

import { Source } from "@/types/chat";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SourceCardProps {
  source: Source;
  index: number;
}

export function SourceCard({ source, index }: SourceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="border-l-4 border-l-primary/50">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1">
            <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Source {index}
                </span>
                {source.metadata.source && (
                  <span className="text-xs text-muted-foreground">
                    • {source.metadata.source}
                  </span>
                )}
                {source.metadata.page && (
                  <span className="text-xs text-muted-foreground">
                    (Page {source.metadata.page})
                  </span>
                )}
                {source.score && (
                  <Badge variant="secondary" className="text-xs">
                    {(source.score * 100).toFixed(0)}% relevant
                  </Badge>
                )}
              </div>

              {source.metadata.category && (
                <Badge variant="outline" className="text-xs">
                  {source.metadata.category}
                </Badge>
              )}

              <p
                className={cn(
                  "text-xs text-muted-foreground",
                  !isExpanded && "line-clamp-2"
                )}
              >
                {source.content}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-shrink-0 p-1 hover:bg-muted rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
