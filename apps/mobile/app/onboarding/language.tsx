import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LanguageOption } from "@/features/onboarding/components/LanguageOption";
import { OnboardingHeader } from "@/features/onboarding/components/OnboardingHeader";
import { OnboardingProgressBar } from "@/features/onboarding/components/OnboardingProgressBar";
import { useStrings } from "@/i18n/strings";
import { useLanguageStore } from "@/store/languageStore";
import { colors } from "@/theme/colors";
import { radii } from "@/theme/radii";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export default function OnboardingLanguageScreen() {
  const router = useRouter();
  const strings = useStrings();
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <View style={styles.headerBlock}>
          <OnboardingHeader step={1} total={3} />
          <View style={styles.progressWrap}>
            <OnboardingProgressBar step={1} total={3} />
          </View>
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.title}>{strings.onboardLanguageTitle}</Text>
          <Text style={styles.subtitle}>{strings.onboardLanguageSubtitle}</Text>
        </View>

        <View style={styles.options}>
          {/* Language autonyms are intentionally not translated — "한국어"
              always reads as "한국어", "English" always reads as "English",
              regardless of which language is currently active. */}
          <LanguageOption
            label="한국어"
            subLabel="Korean"
            selected={language === "ko"}
            onPress={() => setLanguage("ko")}
          />
          <LanguageOption
            label="English"
            subLabel="United States"
            selected={language === "en"}
            onPress={() => setLanguage("en")}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.nextButton} onPress={() => router.push("/onboarding/name")}>
          <Text style={styles.nextButtonText}>{strings.next}</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.onPrimary} />
        </Pressable>
        <Text style={styles.footerNote}>{strings.onboardFooterNote}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: spacing.lg, gap: spacing.xl },
  headerBlock: { gap: spacing.md },
  progressWrap: { paddingHorizontal: 2 },
  titleBlock: { gap: spacing.xs },
  title: { ...typography.headlineLg, color: colors.textPrimary },
  subtitle: { ...typography.bodyMd, color: colors.textSecondary },
  options: { gap: spacing.sm },
  footer: { padding: spacing.lg, paddingTop: 0, gap: spacing.sm },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
  },
  nextButtonText: { ...typography.subheading, color: colors.onPrimary },
  footerNote: { ...typography.caption, color: colors.textTertiary, textAlign: "center" },
});
