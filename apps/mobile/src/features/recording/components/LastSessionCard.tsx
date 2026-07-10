import { StyleSheet, Text, View } from "react-native";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useStrings } from "@/i18n/strings";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export type LastSession = {
  score: number;
  statusType: string;
  comment: string;
  improvementPercent: number | null;
};

function improvementBadge(improvementPercent: number | null, strings: ReturnType<typeof useStrings>) {
  if (improvementPercent === null) return { label: strings.firstSessionBadge, tone: "neutral" as const };
  if (improvementPercent > 0) return { label: strings.improvementBadge(improvementPercent), tone: "success" as const };
  if (improvementPercent < 0) return { label: strings.declineBadge(improvementPercent), tone: "warning" as const };
  return { label: strings.noChangeBadge, tone: "neutral" as const };
}

export function LastSessionCard({ session }: { session: LastSession }) {
  const strings = useStrings();
  const badge = improvementBadge(session.improvementPercent, strings);

  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{strings.lastSessionLabel}</Text>
        <Badge tone={badge.tone} label={badge.label} />
      </View>
      <View style={styles.body}>
        <Text style={styles.score}>{session.score}</Text>
        <View style={styles.textCol}>
          <Text style={styles.statusType}>{session.statusType}</Text>
          <Text style={styles.comment}>{session.comment}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  label: { ...typography.labelCaps, color: colors.textTertiary },
  body: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  score: { ...typography.scoreDisplay, color: colors.textPrimary, minWidth: 64 },
  textCol: { flex: 1, gap: 2 },
  statusType: { ...typography.subheading, color: colors.textPrimary },
  comment: { ...typography.bodySm, color: colors.textSecondary },
});
