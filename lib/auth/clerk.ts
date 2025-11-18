import { auth, currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId, createUser } from "../db/queries";

/**
 * Get or create user in our database based on Clerk authentication
 */
export async function getOrCreateUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Check if user exists in our database
  let user = await getUserByClerkId(userId);

  // If not, create the user
  if (!user) {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      throw new Error("Clerk user not found");
    }

    const email =
      clerkUser.emailAddresses[0]?.emailAddress || `${userId}@unknown.com`;
    const name = clerkUser.firstName
      ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
      : undefined;

    user = await createUser({
      clerkId: userId,
      email,
      name,
    });
  }

  return user;
}

/**
 * Ensure the user is authenticated
 */
export async function requireAuth() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
}
