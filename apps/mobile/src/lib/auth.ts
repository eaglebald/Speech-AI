import { supabase } from "@/lib/supabase";

// The backend trusts this token's `sub` as the recording owner's identity —
// never fall back to a client-generated id (that was the IDOR this replaced).
export async function getAccessToken(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  if (data.session?.access_token) return data.session.access_token;

  const { data: signInData, error } = await supabase.auth.signInAnonymously();
  if (error || !signInData.session) {
    throw error ?? new Error("Anonymous sign-in returned no session");
  }
  return signInData.session.access_token;
}
