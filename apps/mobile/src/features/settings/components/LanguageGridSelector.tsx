import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useLanguageStore, type Language } from "@/store/languageStore";
import { colors } from "@/theme/colors";
import { radii } from "@/theme/radii";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

// Language autonyms are intentionally not translated — "한국어" always reads
// as "한국어", "English" always reads as "English", regardless of the
// currently active app language.
const OPTIONS: { value: Language; label: string; subLabel: string }[] = [
  { value: "ko", label: "한국어", subLabel: "Korean" },
  { value: "en", label: "English", subLabel: "United States" },
];

export function LanguageGridSelector() {
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  return (
    <View style={styles.row}>
      {OPTIONS.map((opt) => {
        const selected = language === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => setLanguage(opt.value)}
            style={[styles.card, selected && styles.cardSelected]}
            accessibilityRole="button"
            accessibilityState={{ selected }}
          >
            {selected ? (
              <View style={styles.checkBadge}>
                <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
              </View>
            ) : null}
            <View style={styles.iconWrap}>
              <Ionicons name="globe-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.label}>{opt.label}</Text>
            <Text style={styles.subLabel}>{opt.subLabel}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: spacing.sm },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  cardSelected: { borderColor: colors.primary, backgroundColor: colors.tipBackground },
  checkBadge: { position: "absolute", top: spacing.sm, right: spacing.sm },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  label: { ...typography.subheading, fontSize: 15, color: colors.textPrimary },
  subLabel: { ...typography.bodySm, color: colors.textSecondary },
});
