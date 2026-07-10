import { StyleSheet, View } from "react-native";

import { colors } from "@/theme/colors";
import { radii } from "@/theme/radii";

export function OnboardingProgressBar({ step, total }: { step: number; total: number }) {
  const ratio = Math.min(1, step / total);
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${ratio * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 4,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceMuted,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: radii.full,
  },
});
