import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useStrings } from "@/i18n/strings";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function RecordButton({ onPress }: { onPress: () => void }) {
  const strings = useStrings();
  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.circle, pressed && styles.circlePressed]}
        accessibilityRole="button"
        accessibilityLabel="Start recording"
      >
        <Ionicons name="mic" size={32} color={colors.onPrimary} />
        <Text style={styles.startLabel}>{strings.startButton}</Text>
      </Pressable>
      <Text style={styles.hint}>{strings.tapToBegin}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", gap: spacing.md },
  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  circlePressed: { backgroundColor: colors.primaryPressed },
  startLabel: { ...typography.labelCaps, color: colors.onPrimary },
  hint: { ...typography.bodySm, color: colors.textSecondary },
});
