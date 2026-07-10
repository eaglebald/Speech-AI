import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export type Purpose = "student" | "job_interview_prep" | "thesis_defense" | "general_speaking";

const STORAGE_KEY = "speechai.profile.v1";

type StoredProfile = {
  name: string;
  purpose: Purpose | null;
  hasOnboarded: boolean;
};

type ProfileState = StoredProfile & {
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  setName: (name: string) => Promise<void>;
  setPurpose: (purpose: Purpose) => Promise<void>;
  completeOnboarding: (purpose: Purpose) => Promise<void>;
};

async function persist(profile: StoredProfile) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

// Hydrated once from AsyncStorage at app start (see app/_layout.tsx), then
// every mutation writes straight through to storage so Settings edits and the
// onboarding-complete flag both survive app restarts.
export const useProfileStore = create<ProfileState>((set, get) => ({
  name: "",
  purpose: null,
  hasOnboarded: false,
  isHydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: StoredProfile = JSON.parse(raw);
        set({ ...parsed, isHydrated: true });
        return;
      }
    } catch {
      // fall through to defaults
    }
    set({ isHydrated: true });
  },

  setName: async (name) => {
    set({ name });
    const { purpose, hasOnboarded } = get();
    await persist({ name, purpose, hasOnboarded });
  },

  setPurpose: async (purpose) => {
    set({ purpose });
    const { name, hasOnboarded } = get();
    await persist({ name, purpose, hasOnboarded });
  },

  completeOnboarding: async (purpose) => {
    set({ purpose, hasOnboarded: true });
    const { name } = get();
    await persist({ name, purpose, hasOnboarded: true });
  },
}));
