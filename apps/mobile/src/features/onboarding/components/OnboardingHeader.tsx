import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useStrings } from "@/i18n/strings";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

export function OnboardingHeader({ step, total, onBack }: { step: number; total: number; onBack?: () => void }) {
  const strings = useStrings();
  return (
    <View style={styles.row}>
      {onBack ? (
        <Pressable onPress={onBack} hitSlop={12} accessibilityLabel={strings.back}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </Pressable>
      ) : (
        <View style={styles.backSpacer} />
      )}
      <Text style={styles.stepLabel}>{strings.onboardStepOf(step, total)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backSpacer: { width: 22 },
  stepLabel: { ...typography.caption, color: colors.textTertiary },
});
