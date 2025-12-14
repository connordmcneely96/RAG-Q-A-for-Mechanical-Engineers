import { ChatInterface } from "@/components/chat/chat-interface";
import { Card } from "@/components/ui/card";

export const dynamic = 'force-dynamic';
export const runtime = "edge";

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-6 h-[calc(100vh-4rem)]">
      <Card className="h-full">
        <ChatInterface />
      </Card>
    </div>
  );
}
