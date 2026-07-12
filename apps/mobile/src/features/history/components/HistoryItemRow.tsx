import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

import type { RecordingListItem } from "@/api/recordings";
import { Badge } from "@/components/ui/Badge";
import { useStrings } from "@/i18n/strings";
import { colors } from "@/theme/colors";
import { radii } from "@/theme/radii";
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

export function HistoryItemRow({
  item,
  onPress,
  onDelete,
}: {
  item: RecordingListItem;
  onPress: () => void;
  onDelete: () => void;
}) {
  const strings = useStrings();
  const swipeableRef = useRef<Swipeable>(null);
  const isCompleted = item.status === "completed" && item.globalScore !== null;
  const isProcessing = item.status === "uploaded" || item.status === "analyzing";

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const scale = dragX.interpolate({ inputRange: [-80, -40, 0], outputRange: [1, 0.6, 0], extrapolate: "clamp" });
    return (
      <Pressable
        style={styles.deleteButton}
        onPress={() => {
          swipeableRef.current?.close();
          onDelete();
        }}
      >
        <Animated.View style={[styles.deleteContent, { transform: [{ scale }] }]}>
          <Ionicons name="trash-outline" size={20} color={colors.onPrimary} />
          <Text style={styles.deleteLabel}>{strings.historyDelete}</Text>
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <View style={styles.swipeWrapper}>
      <Swipeable ref={swipeableRef} renderRightActions={renderRightActions} overshootRight={false} friction={2}>
        <Pressable onPress={onPress} disabled={!isCompleted} style={styles.row}>
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
        </Pressable>
      </Swipeable>
    </View>
  );
}

const styles = StyleSheet.create({
  swipeWrapper: { borderRadius: radii.lg, overflow: "hidden" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  textCol: { flex: 1, gap: 2 },
  date: { ...typography.caption, color: colors.textTertiary },
  summary: { ...typography.bodySm, color: colors.textPrimary },
  processing: { ...typography.bodySm, color: colors.textTertiary },
  failed: { ...typography.bodySm, color: colors.error },
  scoreCol: { alignItems: "flex-end", gap: 4 },
  score: { ...typography.subheading, color: colors.textPrimary },
  deleteButton: {
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.error,
  },
  deleteContent: { alignItems: "center", gap: 4 },
  deleteLabel: { ...typography.caption, color: colors.onPrimary },
});
