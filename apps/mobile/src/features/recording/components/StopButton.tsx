import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useStrings } from "@/i18n/strings";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function StopButton({ onPress }: { onPress: () => void }) {
  const strings = useStrings();
  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.circle, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel="Stop recording"
      >
        <Ionicons name="square" size={26} color={colors.onPrimary} />
      </Pressable>
      <Text style={styles.hint}>{strings.tapToStop}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", gap: spacing.sm },
  circle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.recording,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.recording,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  pressed: { opacity: 0.85 },
  hint: { ...typography.labelCaps, color: colors.recording },
});
