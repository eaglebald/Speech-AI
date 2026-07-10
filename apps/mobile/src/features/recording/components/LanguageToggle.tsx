import { Pressable, StyleSheet, Text, View } from "react-native";

import { useLanguageStore, type Language } from "@/store/languageStore";
import { colors } from "@/theme/colors";
import { radii } from "@/theme/radii";
import { typography } from "@/theme/typography";

const OPTIONS: { value: Language; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "ko", label: "KR" },
];

export function LanguageToggle() {
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  return (
    <View style={styles.track}>
      {OPTIONS.map((opt) => {
        const active = language === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => setLanguage(opt.value)}
            style={[styles.segment, active && styles.segmentActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.full,
    padding: 2,
  },
  segment: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.full,
  },
  segmentActive: { backgroundColor: colors.primary },
  label: { ...typography.caption, fontWeight: "700", color: colors.textSecondary },
  labelActive: { color: colors.onPrimary },
});
