import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrCreateUser } from "@/lib/auth/clerk";

export const dynamic = 'force-dynamic';
export const runtime = "edge";

export default async function DashboardPage() {
  const user = await getOrCreateUser();

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Usage This Month</CardTitle>
            <CardDescription>Your query statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {user.subscription?.queriesUsed || 0} / {user.subscription?.queriesLimit || 50}
            </div>
            <p className="text-sm text-muted-foreground mt-2">queries used</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your subscription tier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold capitalize">
              {user.subscription?.tier || "Free"}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {user.subscription?.status || "active"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Member Since</CardTitle>
            <CardDescription>Account creation date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
