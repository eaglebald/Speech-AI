import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { useStrings } from "@/i18n/strings";
import { colors } from "@/theme/colors";
import { radii } from "@/theme/radii";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function TodaysGoalCard() {
  const strings = useStrings();
  return (
    <View style={styles.container}>
      <Ionicons name="bulb-outline" size={18} color={colors.tipText} style={styles.icon} />
      <View style={styles.textCol}>
        <Text style={styles.label}>{strings.todaysGoalLabel}</Text>
        <Text style={styles.message}>{strings.todaysGoalMessage}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.tipBackground,
    borderRadius: radii.lg,
    padding: spacing.md,
    alignItems: "flex-start",
  },
  icon: { marginTop: 2, marginRight: spacing.sm },
  textCol: { flex: 1, gap: 2 },
  label: { ...typography.labelCaps, color: colors.tipText },
  message: { ...typography.bodySm, color: colors.textPrimary },
});
