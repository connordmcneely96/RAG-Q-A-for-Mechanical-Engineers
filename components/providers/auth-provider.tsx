"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

// Treat missing keys as dev/preview mode (prevents build-time failures)
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isDevelopmentMode = !publishableKey || publishableKey === "pk_test_placeholder";

export function AuthProvider({ children }: { children: ReactNode }) {
  // In development mode, bypass Clerk entirely to allow UI preview
  if (isDevelopmentMode) {
    return <>{children}</>;
  }

  // In production or with real keys, use Clerk
  return <ClerkProvider>{children}</ClerkProvider>;
}
