import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { AnalysisStatus } from "@/api/analysis";
import { AnalysisStepItem, type StepState } from "@/features/analysis/components/AnalysisStepItem";
import { PulsingLogo } from "@/features/analysis/components/PulsingLogo";
import { useAnalysisPolling } from "@/features/analysis/hooks/useAnalysisPolling";
import { AppHeader } from "@/features/recording/components/AppHeader";
import { useStrings } from "@/i18n/strings";
import { colors } from "@/theme/colors";
import { radii } from "@/theme/radii";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

// Backend only reports uploaded/analyzing/completed/failed — no separate
// "generating report" phase — so step 2 stays pending until completion.
function getStepState(index: number, status: AnalysisStatus): StepState {
  if (status === "completed") return "completed";
  if (status === "failed") return index === 0 ? "completed" : "pending";
  if (status === "analyzing") return index === 0 ? "completed" : index === 1 ? "active" : "pending";
  return index === 0 ? "active" : "pending";
}

export default function AnalysisLoadingScreen() {
  const router = useRouter();
  const strings = useStrings();
  const { recordingId } = useLocalSearchParams<{ recordingId: string }>();
  const { status, error } = useAnalysisPolling(recordingId);
  const navigatedRef = useRef(false);

  const steps = [strings.stepExtracting, strings.stepGemini, strings.stepReport];

  useEffect(() => {
    if (status === "completed" && !navigatedRef.current) {
      navigatedRef.current = true;
      router.replace(`/analysis/result/${recordingId}`);
    }
  }, [status, recordingId, router]);

  useEffect(() => {
    if (error && !navigatedRef.current) {
      navigatedRef.current = true;
      Alert.alert(strings.analysisFailedTitle, error, [
        { text: strings.confirm, onPress: () => router.replace("/") },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, router]);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <AppHeader />

        <View style={styles.centerBlock}>
          <PulsingLogo />
          <Text style={styles.title}>{strings.analyzingTitle}</Text>
          <Text style={styles.subtitle}>{strings.analyzingSubtitle}</Text>

          <View style={styles.stepsCard}>
            {steps.map((label, index) => (
              <AnalysisStepItem key={label} label={label} state={getStepState(index, status)} />
            ))}
          </View>
        </View>

        <View style={styles.tipBox}>
          <Text style={styles.tipLabel}>{strings.speakerProTipLabel}</Text>
          <Text style={styles.tipText}>{strings.speakerProTip}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: spacing.lg, justifyContent: "space-between" },
  centerBlock: { alignItems: "center", gap: spacing.sm, marginTop: spacing.xl },
  title: { ...typography.headlineLg, color: colors.textPrimary, marginTop: spacing.md },
  subtitle: { ...typography.bodyMd, color: colors.textSecondary, textAlign: "center" },
  stepsCard: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  tipBox: {
    backgroundColor: colors.tipBackground,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  tipLabel: { ...typography.labelCaps, color: colors.tipText },
  tipText: { ...typography.bodySm, color: colors.textPrimary, marginTop: 2 },
});
