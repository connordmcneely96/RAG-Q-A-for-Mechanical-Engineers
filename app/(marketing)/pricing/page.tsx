"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";
import Link from "next/link";

// Treat missing keys as dev/preview mode (prevents build-time failures)
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isDevelopmentMode = !publishableKey || publishableKey === "pk_test_placeholder";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl">
            MechAssist AI
          </Link>
          <Link href="/">
            <Button variant="ghost">Back to Home</Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-muted-foreground text-lg">
            Choose the plan that fits your engineering workflow
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Tier */}
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>Perfect for trying out MechAssist AI</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              {isDevelopmentMode ? (
                <Button className="w-full" variant="outline">
                  Get Started
                </Button>
              ) : (
                <SignUpButton mode="modal">
                  <Button className="w-full" variant="outline">
                    Get Started
                  </Button>
                </SignUpButton>
              )}
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-sm">50 queries per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-sm">Access to knowledge base</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-sm">Basic engineering support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-sm">Conversation history</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Pro Tier */}
          <Card className="border-primary shadow-lg relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
              Most Popular
            </Badge>
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription>For professional engineers</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Upgrade to Pro</Button>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-sm">500 queries per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-sm">Upload custom documents</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-sm">Priority support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-sm">Advanced analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-sm">Export conversations</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Enterprise Tier */}
          <Card>
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <CardDescription>For teams and organizations</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">Custom</span>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Contact Sales
              </Button>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-sm">Unlimited queries</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-sm">Dedicated vector storage</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-sm">Custom integrations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-sm">On-premise deployment</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-sm">Dedicated support</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
