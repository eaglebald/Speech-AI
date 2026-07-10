import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";

import { useStrings } from "@/i18n/strings";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function DetailsToggle({ expanded, onPress }: { expanded: boolean; onPress: () => void }) {
  const strings = useStrings();
  return (
    <Pressable style={styles.row} onPress={onPress} hitSlop={8}>
      <Text style={styles.label}>{expanded ? strings.hideDetails : strings.viewDetails}</Text>
      <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={14} color={colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: spacing.sm, alignSelf: "flex-start" },
  label: { ...typography.labelCaps, color: colors.primary },
});
