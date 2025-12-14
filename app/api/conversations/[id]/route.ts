import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth/clerk";
import { getConversationById } from "@/lib/db/queries";
import { getPrisma } from "@/lib/db/client";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getOrCreateUser();
    const { id } = params;

    const conversation = await getConversationById(id);

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (conversation.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ conversation });
  } catch (error: any) {
    console.error("Error fetching conversation:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getOrCreateUser();
    const { id } = params;

    const conversation = await getConversationById(id);

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (conversation.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const prisma = getPrisma();
    await prisma.conversation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting conversation:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
