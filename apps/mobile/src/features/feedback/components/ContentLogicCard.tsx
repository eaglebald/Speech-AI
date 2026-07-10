import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/ui/Card";
import { MetricCardHeader } from "@/features/feedback/components/MetricCardHeader";
import { useStrings } from "@/i18n/strings";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import type { ContentLogicMetric } from "@/types/analysis";

export function ContentLogicCard({ metric }: { metric: ContentLogicMetric }) {
  const strings = useStrings();
  return (
    <Card>
      <MetricCardHeader
        icon="git-branch-outline"
        label={strings.contentLogic}
        badgeLabel={metric.statusLabel}
        tone={metric.tone}
      />

      <View style={styles.item}>
        <Ionicons name="checkmark-circle" size={18} color={colors.success} style={styles.itemIcon} />
        <View style={styles.itemTextCol}>
          <Text style={styles.itemTitle}>{metric.strengthTitle}</Text>
          <Text style={styles.itemDescription}>{metric.strengthDescription}</Text>
        </View>
      </View>

      <View style={styles.item}>
        <Ionicons name="bulb-outline" size={18} color={colors.primary} style={styles.itemIcon} />
        <View style={styles.itemTextCol}>
          <Text style={styles.itemTitle}>{metric.tipTitle}</Text>
          <Text style={styles.itemDescription}>{metric.tipDescription}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: "row", marginTop: spacing.sm, gap: spacing.sm },
  itemIcon: { marginTop: 2 },
  itemTextCol: { flex: 1 },
  itemTitle: { ...typography.bodyMd, fontWeight: "700", color: colors.textPrimary },
  itemDescription: { ...typography.bodySm, color: colors.textSecondary, marginTop: 2 },
});
