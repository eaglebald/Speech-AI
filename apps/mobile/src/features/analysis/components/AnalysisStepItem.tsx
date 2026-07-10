import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export type StepState = "pending" | "active" | "completed";

export function AnalysisStepItem({ label, state }: { label: string; state: StepState }) {
  return (
    <View style={styles.row}>
      <View style={styles.iconSlot}>
        {state === "completed" ? (
          <Ionicons name="checkmark-circle" size={22} color={colors.success} />
        ) : state === "active" ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <View style={styles.pendingDot} />
        )}
      </View>
      <Text style={[styles.label, state === "pending" && styles.labelPending]}>{label}</Text>
      <Text
        style={[
          styles.status,
          state === "completed" && styles.statusCompleted,
          state === "active" && styles.statusActive,
        ]}
      >
        {state === "completed" ? "COMPLETED" : state === "active" ? "PROCESSING" : ""}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", paddingVertical: spacing.sm, gap: spacing.sm },
  iconSlot: { width: 24, alignItems: "center", justifyContent: "center" },
  pendingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
  },
  label: { ...typography.bodyMd, color: colors.textPrimary, flex: 1 },
  labelPending: { color: colors.textTertiary },
  status: { ...typography.caption, color: colors.textTertiary },
  statusCompleted: { color: colors.success, fontWeight: "700" },
  statusActive: { color: colors.primary, fontWeight: "700" },
});
