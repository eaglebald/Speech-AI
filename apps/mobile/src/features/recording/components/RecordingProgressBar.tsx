import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";
import { radii } from "@/theme/radii";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { formatMMSS } from "@/utils/formatTime";

export function RecordingProgressBar({
  elapsedSeconds,
  limitSeconds,
}: {
  elapsedSeconds: number;
  limitSeconds: number;
}) {
  const ratio = Math.min(elapsedSeconds / limitSeconds, 1);
  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${ratio * 100}%` }]} />
      </View>
      <View style={styles.labels}>
        <Text style={styles.label}>ELAPSED</Text>
        <Text style={styles.label}>{formatMMSS(limitSeconds)} LIMIT</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  track: {
    height: 6,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceMuted,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: radii.full,
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.xs,
  },
  label: { ...typography.caption, color: colors.textTertiary },
});
