import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { listRecordings } from "@/api/recordings";
import { AppHeader } from "@/features/recording/components/AppHeader";
import { LanguageToggle } from "@/features/recording/components/LanguageToggle";
import { LastSessionCard, type LastSession } from "@/features/recording/components/LastSessionCard";
import { RecordButton } from "@/features/recording/components/RecordButton";
import { TodaysGoalCard } from "@/features/recording/components/TodaysGoalCard";
import { useMicPermission } from "@/features/recording/hooks/useMicPermission";
import { useStrings } from "@/i18n/strings";
import { useProfileStore } from "@/store/profileStore";
import { colors } from "@/theme/colors";
import { radii } from "@/theme/radii";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export default function RecordingHomeScreen() {
  const router = useRouter();
  const strings = useStrings();
  const name = useProfileStore((s) => s.name);
  useMicPermission();

  const [lastSession, setLastSession] = useState<LastSession | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setLoadingSession(true);

      listRecordings()
        .then((items) => {
          if (cancelled) return;
          const scored = items.filter((item) => item.status === "completed" && item.globalScore !== null);
          if (scored.length === 0) {
            setLastSession(null);
            return;
          }
          const [latest, previous] = scored;
          const improvementPercent =
            previous?.globalScore != null && previous.globalScore !== 0
              ? Math.round(((latest.globalScore! - previous.globalScore) / previous.globalScore) * 100)
              : null;
          setLastSession({
            score: latest.globalScore!,
            statusType: latest.statusLabel ?? "",
            comment: latest.summary ?? "",
            improvementPercent,
          });
        })
        .catch(() => {
          if (!cancelled) setLastSession(null);
        })
        .finally(() => {
          if (!cancelled) setLoadingSession(false);
        });

      return () => {
        cancelled = true;
      };
    }, []),
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppHeader extra={<LanguageToggle />} />

        <View style={styles.greeting}>
          <Text style={styles.title}>{strings.homeGreeting(name)}</Text>
          <Text style={styles.subtitle}>{strings.homeSubtitle}</Text>
        </View>

        {loadingSession ? (
          <ActivityIndicator color={colors.primary} />
        ) : lastSession ? (
          <LastSessionCard session={lastSession} />
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>{strings.homeEmptySession}</Text>
          </View>
        )}

        <TodaysGoalCard />

        <View style={styles.recordSection}>
          <RecordButton onPress={() => router.push("/recording/active")} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  greeting: { gap: 4 },
  title: { ...typography.headlineXl, color: colors.textPrimary },
  subtitle: { ...typography.bodyMd, color: colors.textSecondary },
  emptyCard: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  emptyText: { ...typography.bodySm, color: colors.textSecondary, textAlign: "center" },
  recordSection: { alignItems: "center", marginTop: spacing.xl },
});
