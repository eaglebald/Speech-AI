import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { OnboardingHeader } from "@/features/onboarding/components/OnboardingHeader";
import { OnboardingProgressBar } from "@/features/onboarding/components/OnboardingProgressBar";
import { useStrings } from "@/i18n/strings";
import { useProfileStore } from "@/store/profileStore";
import { colors } from "@/theme/colors";
import { radii } from "@/theme/radii";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export default function OnboardingNameScreen() {
  const router = useRouter();
  const strings = useStrings();
  // Onboarding always starts blank, even if a name was saved previously
  // (e.g. re-onboarding after a reset) — Settings is where an existing name is edited.
  const [name, setName] = useState("");

  const handleNext = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    await useProfileStore.getState().setName(trimmed);
    router.push("/onboarding/purpose");
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/onboarding/language");
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.content}>
          <View style={styles.headerBlock}>
            <OnboardingHeader step={2} total={3} onBack={handleBack} />
            <View style={styles.progressWrap}>
              <OnboardingProgressBar step={2} total={3} />
            </View>
          </View>

          <View style={styles.titleBlock}>
            <Text style={styles.title}>{strings.onboardNameTitle}</Text>
            <Text style={styles.subtitle}>{strings.onboardNameSubtitle}</Text>
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>{strings.onboardNameLabel}</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={strings.onboardNamePlaceholder}
              placeholderTextColor={colors.textTertiary}
              style={styles.input}
              autoFocus
              returnKeyType="next"
              onSubmitEditing={handleNext}
            />
          </View>

          <View style={styles.identityCard}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
            <View style={styles.identityTextCol}>
              <Text style={styles.identityTitle}>{strings.onboardIdentityTitle}</Text>
              <Text style={styles.identityDescription}>{strings.onboardIdentityDescription}</Text>
            </View>
          </View>
        </View>

        <Pressable
          style={[styles.nextButton, !name.trim() && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!name.trim()}
        >
          <Text style={styles.nextButtonText}>{strings.next}</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.onPrimary} />
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1, justifyContent: "space-between" },
  content: { padding: spacing.lg, gap: spacing.xl },
  headerBlock: { gap: spacing.md },
  progressWrap: { paddingHorizontal: 2 },
  titleBlock: { gap: spacing.xs },
  title: { ...typography.headlineLg, color: colors.textPrimary },
  subtitle: { ...typography.bodyMd, color: colors.textSecondary },
  fieldBlock: { gap: spacing.xs },
  fieldLabel: { ...typography.labelCaps, color: colors.textSecondary },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  identityCard: {
    flexDirection: "row",
    gap: spacing.sm,
    backgroundColor: colors.tipBackground,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  identityTextCol: { flex: 1, gap: 2 },
  identityTitle: { ...typography.bodyMd, fontWeight: "700", color: colors.textPrimary },
  identityDescription: { ...typography.bodySm, color: colors.textSecondary },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    margin: spacing.lg,
  },
  nextButtonDisabled: { opacity: 0.5 },
  nextButtonText: { ...typography.subheading, color: colors.onPrimary },
});
