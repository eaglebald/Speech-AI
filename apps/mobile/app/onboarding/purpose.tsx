import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { OnboardingHeader } from "@/features/onboarding/components/OnboardingHeader";
import { OnboardingProgressBar } from "@/features/onboarding/components/OnboardingProgressBar";
import { PurposeSelector } from "@/features/onboarding/components/PurposeSelector";
import { useStrings } from "@/i18n/strings";
import { useProfileStore, type Purpose } from "@/store/profileStore";
import { colors } from "@/theme/colors";
import { radii } from "@/theme/radii";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export default function OnboardingPurposeScreen() {
  const router = useRouter();
  const strings = useStrings();
  // Onboarding always starts with nothing selected — Settings is where an
  // existing purpose is edited.
  const [purpose, setPurpose] = useState<Purpose | null>(null);

  const handleGetStarted = async () => {
    if (!purpose) return;
    await useProfileStore.getState().completeOnboarding(purpose);
    router.replace("/");
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/onboarding/name");
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.headerBlock}>
        <OnboardingHeader step={3} total={3} onBack={handleBack} />
        <View style={styles.progressWrap}>
          <OnboardingProgressBar step={3} total={3} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{strings.onboardPurposeTitle}</Text>
          <Text style={styles.subtitle}>{strings.onboardPurposeSubtitle}</Text>
        </View>

        <PurposeSelector value={purpose} onChange={setPurpose} />
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.getStartedButton, !purpose && styles.getStartedButtonDisabled]}
          onPress={handleGetStarted}
          disabled={!purpose}
        >
          <Text style={styles.getStartedText}>{strings.getStarted}</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.onPrimary} />
        </Pressable>
        <Text style={styles.footerNote}>{strings.onboardFooterNote}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  headerBlock: { padding: spacing.lg, paddingBottom: 0, gap: spacing.md },
  progressWrap: { paddingHorizontal: 2 },
  content: { padding: spacing.lg, gap: spacing.lg },
  titleBlock: { gap: spacing.xs },
  title: { ...typography.headlineLg, color: colors.textPrimary },
  subtitle: { ...typography.bodyMd, color: colors.textSecondary },
  footer: { padding: spacing.lg, paddingTop: 0, gap: spacing.sm },
  getStartedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
  },
  getStartedButtonDisabled: { opacity: 0.5 },
  getStartedText: { ...typography.subheading, color: colors.onPrimary },
  footerNote: { ...typography.caption, color: colors.textTertiary, textAlign: "center" },
});
