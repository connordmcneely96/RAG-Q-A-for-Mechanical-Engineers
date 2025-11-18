"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import {
  Wrench,
  Zap,
  FileSearch,
  Code,
  Calculator,
  BookOpen,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

// Check if we're in development mode
const isDevelopmentMode = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === 'pk_test_placeholder';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Wrench className="w-6 h-6 text-primary" />
            <span>MechAssist AI</span>
          </Link>

          <div className="flex items-center gap-4">
            {isDevelopmentMode ? (
              // Development mode: show static buttons
              <>
                <Link href="/chat">
                  <Button>Go to App</Button>
                </Link>
              </>
            ) : (
              // Production mode: use Clerk components
              <>
                <SignedIn>
                  <Link href="/chat">
                    <Button>Go to App</Button>
                  </Link>
                </SignedIn>

                <SignedOut>
                  <SignInButton mode="modal">
                    <Button variant="ghost">Sign In</Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button>Get Started Free</Button>
                  </SignUpButton>
                </SignedOut>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-4" variant="secondary">
          Powered by Google Gemini 2.0 Flash
        </Badge>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-engineering-blueprint">
          Your AI-Powered Mechanical Engineering Assistant
        </h1>

        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Get instant, accurate answers to your engineering questions. Access comprehensive
          knowledge about CAD, materials, manufacturing, and design standards.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          {isDevelopmentMode ? (
            // Development mode: show static buttons
            <>
              <Link href="/chat">
                <Button size="lg" className="gap-2">
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline">
                  View Pricing
                </Button>
              </Link>
            </>
          ) : (
            // Production mode: use Clerk components
            <>
              <SignedOut>
                <SignUpButton mode="modal">
                  <Button size="lg" className="gap-2">
                    Start Free Trial <ArrowRight className="w-4 h-4" />
                  </Button>
                </SignUpButton>
              </SignedOut>

              <SignedIn>
                <Link href="/chat">
                  <Button size="lg" className="gap-2">
                    Go to Chat <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </SignedIn>

              <Link href="/pricing">
                <Button size="lg" variant="outline">
                  View Pricing
                </Button>
              </Link>
            </>
          )}
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>50 Free Queries/Month</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>No Credit Card Required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Full Feature Access</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Powerful Features for Engineers</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to accelerate your mechanical engineering workflow
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Zap className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Instant Answers</CardTitle>
              <CardDescription>
                Get accurate engineering answers in seconds, not hours of searching
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <FileSearch className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Source Citations</CardTitle>
              <CardDescription>
                Every answer includes references to standards, textbooks, and documentation
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Code className="w-10 h-10 text-primary mb-2" />
              <CardTitle>LaTeX & Code Support</CardTitle>
              <CardDescription>
                View beautifully rendered equations and syntax-highlighted code examples
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Calculator className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Design Calculations</CardTitle>
              <CardDescription>
                Step-by-step calculations for stress, strain, thermal, and more
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BookOpen className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Comprehensive Knowledge</CardTitle>
              <CardDescription>
                Pre-loaded with ASME, ISO, material properties, and CAD best practices
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Wrench className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Manufacturing Insights</CardTitle>
              <CardDescription>
                Guidance on CNC, injection molding, sheet metal, and 3D printing
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-primary to-engineering-blueprint text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to accelerate your engineering workflow?</h2>
            <p className="text-primary-50 mb-8 text-lg">
              Join thousands of engineers using AI to solve complex problems faster
            </p>

            {isDevelopmentMode ? (
              // Development mode: show static button
              <Link href="/chat">
                <Button size="lg" variant="secondary" className="gap-2">
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              // Production mode: use Clerk components
              <>
                <SignedOut>
                  <SignUpButton mode="modal">
                    <Button size="lg" variant="secondary" className="gap-2">
                      Start Free Trial <ArrowRight className="w-4 h-4" />
                    </Button>
                  </SignUpButton>
                </SignedOut>

                <SignedIn>
                  <Link href="/chat">
                    <Button size="lg" variant="secondary" className="gap-2">
                      Go to Chat <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </SignedIn>
              </>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 MechAssist AI. Built with ❤️ for mechanical engineers.</p>
        </div>
      </footer>
    </div>
  );
}
