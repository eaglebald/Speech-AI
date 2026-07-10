import { create } from "zustand";

import { getAccessToken } from "@/lib/auth";

type AuthState = {
  isHydrated: boolean;
  hydrate: () => Promise<void>;
};

// Ensures a Supabase anonymous session exists before any screen can fire an
// upload/list request — the app gate in _layout.tsx waits on isHydrated
// alongside profileStore/languageStore.
export const useAuthStore = create<AuthState>((set) => ({
  isHydrated: false,

  hydrate: async () => {
    try {
      await getAccessToken();
    } catch {
      // No network / Supabase unreachable at cold start — let the app
      // through anyway; getAccessToken() is retried lazily per-request by
      // the API client, so it recovers once connectivity returns.
    }
    set({ isHydrated: true });
  },
}));
