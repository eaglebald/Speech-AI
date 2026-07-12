import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, LayoutAnimation, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { deleteRecording, listRecordings, type RecordingListItem } from "@/api/recordings";
import { HistoryItemRow } from "@/features/history/components/HistoryItemRow";
import { AppHeader } from "@/features/recording/components/AppHeader";
import { useStrings } from "@/i18n/strings";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export default function HistoryScreen() {
  const router = useRouter();
  const strings = useStrings();
  const [items, setItems] = useState<RecordingListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setLoading(true);

      listRecordings(50)
        .then((data) => {
          if (!cancelled) setItems(data);
        })
        .catch(() => {
          if (!cancelled) setItems([]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });

      return () => {
        cancelled = true;
      };
    }, []),
  );

  const handleDelete = async (recordingId: string) => {
    try {
      await deleteRecording(recordingId);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setItems((prev) => prev.filter((item) => item.recordingId !== recordingId));
    } catch (error) {
      const serverMessage = axios.isAxiosError(error) ? error.response?.data?.error?.message : undefined;
      Alert.alert(strings.historyDeleteFailedTitle, serverMessage ?? strings.historyDeleteFailedMessage, [
        { text: strings.confirm },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <AppHeader />
        <Text style={styles.title}>{strings.historyTitle}</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      ) : items.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>{strings.historyEmpty}</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.recordingId}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.swipeHint}>
              <Ionicons name="arrow-back-outline" size={14} color={colors.textTertiary} />
              <Text style={styles.swipeHintText}>{strings.historySwipeHint}</Text>
            </View>
          }
          renderItem={({ item }) => (
            <HistoryItemRow
              item={item}
              onPress={() => router.push(`/analysis/result/${item.recordingId}`)}
              onDelete={() => handleDelete(item.recordingId)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg, paddingBottom: spacing.sm, gap: spacing.sm },
  title: { ...typography.headlineLg, color: colors.textPrimary },
  loader: { marginTop: spacing.xl },
  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.lg },
  emptyText: { ...typography.bodyMd, color: colors.textSecondary },
  listContent: { padding: spacing.lg, paddingTop: 0, gap: spacing.sm },
  swipeHint: { flexDirection: "row", alignItems: "center", gap: 4, paddingBottom: spacing.xs },
  swipeHintText: { ...typography.caption, color: colors.textTertiary },
});
