import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth/clerk";
import { getConversationsByUserId } from "@/lib/db/queries";

export async function GET() {
  try {
    const user = await getOrCreateUser();

    const conversations = await getConversationsByUserId(user.id);

    return NextResponse.json({ conversations });
  } catch (error: any) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
