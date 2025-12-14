import { SignIn } from "@clerk/nextjs";

export const runtime = "edge";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-engineering-blueprint to-primary-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">MechAssist AI</h1>
          <p className="text-primary-100">Your Intelligent Engineering Assistant</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-2xl",
            },
          }}
        />
      </div>
    </div>
  );
}
