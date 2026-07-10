import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/ui/Card";
import { MetricCardHeader } from "@/features/feedback/components/MetricCardHeader";
import { useStrings } from "@/i18n/strings";
import { useAudioPlayerStore } from "@/store/audioPlayerStore";
import { colors } from "@/theme/colors";
import { radii } from "@/theme/radii";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import type { FillerWordsMetric } from "@/types/analysis";
import { parseTimestampToSeconds } from "@/utils/formatTime";

export function FillerWordsCard({ metric }: { metric: FillerWordsMetric }) {
  const seekAndPlay = useAudioPlayerStore((s) => s.seekAndPlay);
  const strings = useStrings();

  return (
    <Card>
      <MetricCardHeader
        icon="chatbubble-ellipses-outline"
        label={strings.fillerWords}
        badgeLabel={`${metric.count} DETECTIONS`}
        tone={metric.tone}
      />
      <View style={styles.grid}>
        {metric.words.map((w) => (
          <Pressable
            key={`${w.word}-${w.timestamp}`}
            style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
            onPress={() => seekAndPlay(parseTimestampToSeconds(w.timestamp))}
            accessibilityRole="button"
            accessibilityLabel={`Play audio at ${w.timestamp}`}
          >
            <Text style={styles.chipWord}>&quot;{w.word}&quot;</Text>
            <View style={styles.chipTimeRow}>
              <Ionicons name="play" size={10} color={colors.textTertiary} />
              <Text style={styles.chipTime}>{w.timestamp}</Text>
            </View>
          </Pressable>
        ))}
      </View>
      <View style={styles.tipBox}>
        <Text style={styles.tipText}>{metric.tip}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.xs },
  chip: {
    width: "47%",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  chipPressed: { backgroundColor: colors.border },
  chipWord: { ...typography.subheading, fontSize: 15, color: colors.textPrimary },
  chipTimeRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  chipTime: { ...typography.caption, color: colors.textTertiary },
  tipBox: {
    backgroundColor: colors.tipBackground,
    borderRadius: radii.md,
    padding: spacing.sm,
    marginTop: spacing.md,
  },
  tipText: { ...typography.bodySm, color: colors.tipText },
});
