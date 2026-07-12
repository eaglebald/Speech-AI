import { Redirect, Stack } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useAuthStore } from "@/store/authStore";
import { useLanguageStore } from "@/store/languageStore";
import { useProfileStore } from "@/store/profileStore";
import { colors } from "@/theme/colors";

export default function RootLayout() {
  const isProfileHydrated = useProfileStore((s) => s.isHydrated);
  const hasOnboarded = useProfileStore((s) => s.hasOnboarded);
  const hydrateProfile = useProfileStore((s) => s.hydrate);

  const isLanguageHydrated = useLanguageStore((s) => s.isHydrated);
  const hydrateLanguage = useLanguageStore((s) => s.hydrate);

  const isAuthHydrated = useAuthStore((s) => s.isHydrated);
  const hydrateAuth = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrateProfile();
    hydrateLanguage();
    hydrateAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isProfileHydrated || !isLanguageHydrated || !isAuthHydrated) {
    // Brief AsyncStorage read on cold start — plain background avoids a white flash.
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }} />
        {!hasOnboarded && <Redirect href="/onboarding/language" />}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
