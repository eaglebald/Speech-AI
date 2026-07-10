import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getAnalysisStatus } from "@/api/analysis";
import { Badge } from "@/components/ui/Badge";
import { AudioPlayerBar } from "@/features/feedback/components/AudioPlayerBar";
import { ContentLogicCard } from "@/features/feedback/components/ContentLogicCard";
import { EnergyCard } from "@/features/feedback/components/EnergyCard";
import { FillerWordsCard } from "@/features/feedback/components/FillerWordsCard";
import { PaceCard } from "@/features/feedback/components/PaceCard";
import { ScoreGauge } from "@/features/feedback/components/ScoreGauge";
import { AppHeader } from "@/features/recording/components/AppHeader";
import { useStrings } from "@/i18n/strings";
import { colors } from "@/theme/colors";
import { radii } from "@/theme/radii";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import type { FeedbackResult } from "@/types/analysis";
import { scoreToTone } from "@/utils/statusType";

export default function FeedbackResultScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [result, setResult] = useState<FeedbackResult | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  const strings = useStrings();

  useEffect(() => {
    let cancelled = false;
    if (!id) return;

    getAnalysisStatus(id)
      .then((res) => {
        if (cancelled) return;
        if (res.result) {
          setResult(res.result);
          setAudioUrl(res.audioUrl);
        } else {
          setLoadError(true);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loadError) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.centerFill}>
          <Text style={styles.errorText}>{strings.resultLoadError}</Text>
          <Pressable style={styles.practiceButton} onPress={() => router.replace("/")}>
            <Text style={styles.practiceButtonText}>{strings.goHome}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!result) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.centerFill}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Index 1 (the player wrap) is the sticky header — it scrolls with the
          gauge/summary above it, then pins under the app header once reached. */}
      <ScrollView contentContainerStyle={styles.scrollContent} stickyHeaderIndices={[1]}>
        <View style={styles.topSection}>
          <AppHeader />
          <View style={styles.gaugeBlock}>
            <ScoreGauge score={result.globalScore} />
            <Badge label={result.statusLabel} tone={scoreToTone(result.globalScore)} />
            <Text style={styles.summary}>{result.summary}</Text>
          </View>
        </View>

        <View style={styles.stickyWrap}>
          <AudioPlayerBar audioUrl={audioUrl} />
        </View>

        <View style={styles.bottomSection}>
          <PaceCard metric={result.pace} />
          <EnergyCard metric={result.energy} />
          <FillerWordsCard metric={result.fillerWords} />
          <ContentLogicCard metric={result.contentLogic} />

          <Pressable style={styles.practiceButton} onPress={() => router.replace("/")}>
            <Ionicons name="refresh" size={18} color={colors.onPrimary} />
            <Text style={styles.practiceButtonText}>{strings.practiceAgain}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: spacing.xxl },
  centerFill: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.md, padding: spacing.lg },
  errorText: { ...typography.bodyMd, color: colors.textSecondary },
  topSection: { padding: spacing.lg, paddingBottom: 0 },
  gaugeBlock: { alignItems: "center", gap: spacing.sm, marginVertical: spacing.md },
  summary: { ...typography.bodyMd, color: colors.textSecondary, textAlign: "center", paddingHorizontal: spacing.md },
  stickyWrap: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  bottomSection: { padding: spacing.lg, paddingTop: 0, gap: spacing.md },
  practiceButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  practiceButtonText: { ...typography.subheading, color: colors.onPrimary },
});
