import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth/clerk";
import { createFeedback } from "@/lib/db/queries";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser();
    const { messageId, helpful, comment } = await req.json();

    if (!messageId || typeof helpful !== "boolean") {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const feedback = await createFeedback({
      userId: user.id,
      messageId,
      helpful,
      comment,
    });

    return NextResponse.json({ feedback });
  } catch (error: any) {
    console.error("Error creating feedback:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
