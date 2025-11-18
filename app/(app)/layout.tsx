import { AuthProvider } from "@/components/providers/auth-provider";
import { Header } from "@/components/layouts/header";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
    </AuthProvider>
  );
}
