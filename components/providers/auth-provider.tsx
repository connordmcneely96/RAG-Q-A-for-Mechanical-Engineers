"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

// Check if we're in development mode with placeholder keys
const isDevelopmentMode = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === 'pk_test_placeholder';

export function AuthProvider({ children }: { children: ReactNode }) {
  // In development mode, bypass Clerk entirely to allow UI preview
  if (isDevelopmentMode) {
    return <>{children}</>;
  }

  // In production or with real keys, use Clerk
  return <ClerkProvider>{children}</ClerkProvider>;
}
