import { StyleSheet, View } from "react-native";

import { PurposeOption } from "@/features/onboarding/components/PurposeOption";
import { useStrings } from "@/i18n/strings";
import { spacing } from "@/theme/spacing";
import type { Purpose } from "@/store/profileStore";

export function PurposeSelector({
  value,
  onChange,
}: {
  value: Purpose | null;
  onChange: (purpose: Purpose) => void;
}) {
  const strings = useStrings();

  const options: { key: Purpose; icon: "school-outline" | "briefcase-outline" | "ribbon-outline" | "rocket-outline"; title: string; description: string }[] = [
    { key: "student", icon: "school-outline", title: strings.purposeStudentTitle, description: strings.purposeStudentDescription },
    {
      key: "job_interview_prep",
      icon: "briefcase-outline",
      title: strings.purposeJobInterviewTitle,
      description: strings.purposeJobInterviewDescription,
    },
    { key: "thesis_defense", icon: "ribbon-outline", title: strings.purposeThesisTitle, description: strings.purposeThesisDescription },
    { key: "general_speaking", icon: "rocket-outline", title: strings.purposeGeneralTitle, description: strings.purposeGeneralDescription },
  ];

  return (
    <View style={styles.list}>
      {options.map((opt) => (
        <PurposeOption
          key={opt.key}
          icon={opt.icon}
          title={opt.title}
          description={opt.description}
          selected={value === opt.key}
          onPress={() => onChange(opt.key)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm },
});
