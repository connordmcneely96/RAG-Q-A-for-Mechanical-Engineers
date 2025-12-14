export function isPreviewMode(): boolean {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey || publishableKey === "pk_test_placeholder") return true;

  // Optional explicit override
  if (process.env.MECHASSIST_PREVIEW === "1") return true;

  return false;
}
