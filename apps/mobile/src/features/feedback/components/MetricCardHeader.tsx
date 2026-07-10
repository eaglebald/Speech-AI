import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Badge } from "@/components/ui/Badge";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import type { StatusTone } from "@/types/analysis";

export function MetricCardHeader({
  icon,
  label,
  badgeLabel,
  tone,
}: {
  icon: ComponentProps<typeof Ionicons>["name"];
  label: string;
  badgeLabel: string;
  tone: StatusTone;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Ionicons name={icon} size={16} color={colors.textSecondary} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Badge label={badgeLabel} tone={tone} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.sm },
  left: { flexDirection: "row", alignItems: "center", gap: 6 },
  label: { ...typography.labelCaps, color: colors.textSecondary },
});
