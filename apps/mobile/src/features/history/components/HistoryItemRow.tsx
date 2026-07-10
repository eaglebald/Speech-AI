import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { RecordingListItem } from "@/api/recordings";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useStrings } from "@/i18n/strings";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { scoreToTone } from "@/utils/statusType";

function formatDate(iso: string) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
    " " +
    d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
  );
}

export function HistoryItemRow({ item, onPress }: { item: RecordingListItem; onPress: () => void }) {
  const strings = useStrings();
  const isCompleted = item.status === "completed" && item.globalScore !== null;
  const isProcessing = item.status === "uploaded" || item.status === "analyzing";

  return (
    <Pressable onPress={onPress} disabled={!isCompleted}>
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.textCol}>
            <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
            {isCompleted ? (
              <Text style={styles.summary} numberOfLines={2}>
                {item.summary}
              </Text>
            ) : isProcessing ? (
              <Text style={styles.processing}>{strings.historyProcessing}</Text>
            ) : (
              <Text style={styles.failed}>{strings.historyFailed}</Text>
            )}
          </View>
          {isCompleted ? (
            <View style={styles.scoreCol}>
              <Text style={styles.score}>{item.globalScore}</Text>
              <Badge label={item.statusLabel ?? ""} tone={scoreToTone(item.globalScore!)} />
            </View>
          ) : isProcessing ? (
            <Ionicons name="time-outline" size={20} color={colors.textTertiary} />
          ) : (
            <Ionicons name="alert-circle-outline" size={20} color={colors.error} />
          )}
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { paddingVertical: spacing.md },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  textCol: { flex: 1, gap: 2 },
  date: { ...typography.caption, color: colors.textTertiary },
  summary: { ...typography.bodySm, color: colors.textPrimary },
  processing: { ...typography.bodySm, color: colors.textTertiary },
  failed: { ...typography.bodySm, color: colors.error },
  scoreCol: { alignItems: "flex-end", gap: 4 },
  score: { ...typography.subheading, color: colors.textPrimary },
});
