"use client";

import Link from "next/link";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Wrench, MessageSquare, BookOpen, LayoutDashboard, User } from "lucide-react";

// Check if we're in development mode
const isDevelopmentMode = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === 'pk_test_placeholder';

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Wrench className="w-6 h-6 text-primary" />
            <span>MechAssist AI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {isDevelopmentMode ? (
              // Development mode: show all nav links
              <>
                <Link
                  href="/chat"
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </Link>
                <Link
                  href="/knowledge"
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Knowledge Base
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              </>
            ) : (
              // Production mode: use Clerk components
              <SignedIn>
                <Link
                  href="/chat"
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </Link>
                <Link
                  href="/knowledge"
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Knowledge Base
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              </SignedIn>
            )}

            <Link
              href="/pricing"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Pricing
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isDevelopmentMode ? (
            // Development mode: show mock user button
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="w-4 h-4" />
              Demo User
            </Button>
          ) : (
            // Production mode: use Clerk components
            <>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </SignInButton>
                <SignInButton mode="modal">
                  <Button size="sm">Get Started</Button>
                </SignInButton>
              </SignedOut>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
