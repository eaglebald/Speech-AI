import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "@/components/ui/Card";
import { PurposeSelector } from "@/features/onboarding/components/PurposeSelector";
import { AppHeader } from "@/features/recording/components/AppHeader";
import { LanguageGridSelector } from "@/features/settings/components/LanguageGridSelector";
import { useStrings } from "@/i18n/strings";
import { useProfileStore, type Purpose } from "@/store/profileStore";
import { colors } from "@/theme/colors";
import { radii } from "@/theme/radii";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export default function SettingsScreen() {
  const strings = useStrings();
  const storedName = useProfileStore((s) => s.name);
  const storedPurpose = useProfileStore((s) => s.purpose);

  const [name, setName] = useState(storedName);
  const [purpose, setPurpose] = useState<Purpose | null>(storedPurpose);
  const [justSaved, setJustSaved] = useState(false);

  const isDirty = name.trim() !== storedName || purpose !== storedPurpose;

  const handleSave = async () => {
    await useProfileStore.getState().setName(name.trim());
    if (purpose) await useProfileStore.getState().setPurpose(purpose);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1500);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppHeader />
        <Text style={styles.title}>{strings.settingsTitle}</Text>

        <Card style={styles.card}>
          <Text style={styles.fieldLabel}>{strings.settingsNameLabel}</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={strings.onboardNamePlaceholder}
            placeholderTextColor={colors.textTertiary}
            style={styles.input}
          />
        </Card>

        <View style={styles.languageBlock}>
          <Text style={styles.fieldLabel}>{strings.settingsLanguageLabel}</Text>
          <LanguageGridSelector />
        </View>

        <View style={styles.purposeBlock}>
          <Text style={styles.fieldLabel}>{strings.settingsPurposeLabel}</Text>
          <PurposeSelector value={purpose} onChange={setPurpose} />
        </View>

        <Pressable
          style={[styles.saveButton, (!isDirty || !purpose) && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!isDirty || !purpose}
        >
          <Text style={styles.saveButtonText}>{justSaved ? strings.saved : strings.save}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  title: { ...typography.headlineLg, color: colors.textPrimary },
  card: { gap: spacing.xs },
  languageBlock: { gap: spacing.sm },
  fieldLabel: { ...typography.labelCaps, color: colors.textSecondary },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    marginTop: spacing.xs,
  },
  purposeBlock: { gap: spacing.sm },
  saveButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
  },
  saveButtonDisabled: { opacity: 0.5 },
  saveButtonText: { ...typography.subheading, color: colors.onPrimary },
});
