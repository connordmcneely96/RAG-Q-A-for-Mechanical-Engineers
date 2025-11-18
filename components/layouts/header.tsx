"use client";

import Link from "next/link";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Wrench, MessageSquare, BookOpen, LayoutDashboard } from "lucide-react";

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

            <Link
              href="/pricing"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Pricing
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
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
        </div>
      </div>
    </header>
  );
}
