import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";
import { radii } from "@/theme/radii";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

// `extra` renders just to the left of the avatar — used by the Home screen to
// place the EN/KR language toggle there without affecting any other screen
// that reuses this shared header.
export function AppHeader({ extra }: { extra?: ReactNode } = {}) {
  return (
    <View style={styles.row}>
      <View style={styles.brand}>
        <View style={styles.logoMark}>
          <Ionicons name="mic" size={16} color={colors.onPrimary} />
        </View>
        <Text style={styles.brandText}>SpeechAi</Text>
      </View>
      <View style={styles.rightGroup}>
        {extra}
        <View style={styles.avatar}>
          <Ionicons name="person" size={18} color={colors.textTertiary} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  logoMark: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  brandText: { ...typography.subheading, color: colors.textPrimary },
  rightGroup: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
});
