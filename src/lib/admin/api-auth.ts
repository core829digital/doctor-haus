export async function verifyAdminToken(token: string): Promise<boolean> {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) return false;
  try {
    const res = await fetch(`${convexUrl}/api/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: "adminAuth:verifySession",
        args: { token },
      }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data !== null && data !== undefined;
  } catch {
    return false;
  }
}
