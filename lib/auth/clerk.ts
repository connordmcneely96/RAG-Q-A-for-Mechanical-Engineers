import { auth, currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId, createUser } from "../db/queries";

// Development mode: check if using placeholder keys
const isDevelopmentMode = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === 'pk_test_placeholder';

/**
 * Get or create user in our database based on Clerk authentication
 */
export async function getOrCreateUser() {
  // In development mode with placeholder keys, return a mock user for UI preview
  if (isDevelopmentMode) {
    return {
      id: 'dev-user-id',
      clerkId: 'dev-clerk-id',
      email: 'demo@mechassist.ai',
      name: 'Demo User',
      createdAt: new Date(),
      updatedAt: new Date(),
      subscription: {
        id: 'dev-sub-id',
        userId: 'dev-user-id',
        tier: 'free',
        status: 'active',
        queriesUsed: 15,
        queriesLimit: 50,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
  }

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
