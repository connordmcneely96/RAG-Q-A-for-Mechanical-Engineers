import { AuthProvider } from "@/components/providers/auth-provider";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
