import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/ui/Card";
import { DetailsToggle } from "@/components/ui/DetailsToggle";
import { MetricCardHeader } from "@/features/feedback/components/MetricCardHeader";
import { ScriptView } from "@/features/feedback/components/ScriptView";
import { useStrings } from "@/i18n/strings";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import type { PaceMetric } from "@/types/analysis";

export function PaceCard({ metric }: { metric: PaceMetric }) {
  const [expanded, setExpanded] = useState(false);
  const strings = useStrings();

  return (
    <Card>
      <MetricCardHeader icon="speedometer-outline" label={strings.pace} badgeLabel={metric.statusLabel} tone={metric.tone} />
      <View style={styles.valueRow}>
        <Text style={styles.value}>{metric.wpm}</Text>
        <Text style={styles.unit}>WPM</Text>
      </View>
      <Text style={styles.description}>{metric.description}</Text>

      <DetailsToggle expanded={expanded} onPress={() => setExpanded((v) => !v)} />
      {expanded ? <ScriptView sentences={metric.sentences} colorCoded legend={strings.energyLegend} /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  valueRow: { flexDirection: "row", alignItems: "flex-end", gap: 6 },
  value: { ...typography.scoreDisplay, fontSize: 36, color: colors.textPrimary },
  unit: { ...typography.bodySm, color: colors.textTertiary, marginBottom: 6 },
  description: { ...typography.bodySm, color: colors.textSecondary, marginTop: 4 },
});
