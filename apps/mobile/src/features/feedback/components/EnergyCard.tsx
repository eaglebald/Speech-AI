import { useState } from "react";
import { StyleSheet, Text } from "react-native";

import { Card } from "@/components/ui/Card";
import { DetailsToggle } from "@/components/ui/DetailsToggle";
import { MetricCardHeader } from "@/features/feedback/components/MetricCardHeader";
import { ScriptView } from "@/features/feedback/components/ScriptView";
import { useStrings } from "@/i18n/strings";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import type { EnergyMetric } from "@/types/analysis";

export function EnergyCard({ metric }: { metric: EnergyMetric }) {
  const [expanded, setExpanded] = useState(false);
  const strings = useStrings();

  return (
    <Card>
      <MetricCardHeader icon="flash-outline" label={strings.energy} badgeLabel={`${metric.score}/100`} tone={metric.tone} />
      <Text style={styles.title}>{metric.title}</Text>
      <Text style={styles.description}>{metric.description}</Text>

      <DetailsToggle expanded={expanded} onPress={() => setExpanded((v) => !v)} />
      {expanded ? <ScriptView sentences={metric.sentences} colorCoded legend={strings.energyLegend} /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.subheading, color: colors.textPrimary, marginTop: 4 },
  description: { ...typography.bodySm, color: colors.textSecondary, marginTop: 4 },
});
