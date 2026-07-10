import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";
import { radii } from "@/theme/radii";
import { typography } from "@/theme/typography";

export type BadgeTone = "success" | "warning" | "error" | "neutral";

const toneStyles: Record<BadgeTone, { bg: string; fg: string }> = {
  success: { bg: colors.successMuted, fg: colors.success },
  warning: { bg: colors.warningMuted, fg: colors.warning },
  error: { bg: colors.errorMuted, fg: colors.error },
  neutral: { bg: colors.surfaceMuted, fg: colors.textSecondary },
};

export function Badge({ label, tone = "neutral" }: { label: string; tone?: BadgeTone }) {
  const t = toneStyles[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }]}>
      <Text style={[styles.label, { color: t.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
    alignSelf: "flex-start",
  },
  label: { ...typography.caption, fontWeight: "700" },
});
