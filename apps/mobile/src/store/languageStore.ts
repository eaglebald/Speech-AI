import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export type Language = "ko" | "en";

const STORAGE_KEY = "speechai.language.v1";

type LanguageState = {
  language: Language;
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  setLanguage: (language: Language) => void;
};

// First chosen on the onboarding Language step (and re-selectable anytime via
// the Home header pill or Settings) — governs the upload payload (Gemini's
// STT/output language) and every screen's static UI copy via useStrings().
export const useLanguageStore = create<LanguageState>((set) => ({
  language: "ko",
  isHydrated: false,

  hydrate: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored === "ko" || stored === "en") {
        set({ language: stored, isHydrated: true });
        return;
      }
    } catch {
      // fall through to default
    }
    set({ isHydrated: true });
  },

  setLanguage: (language) => {
    set({ language });
    AsyncStorage.setItem(STORAGE_KEY, language).catch(() => {});
  },
}));
