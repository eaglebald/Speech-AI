import { StyleSheet, Text, View } from "react-native";

import { ScriptSentenceRow } from "@/features/feedback/components/ScriptSentenceRow";
import { useStrings } from "@/i18n/strings";
import { useAudioPlayerStore } from "@/store/audioPlayerStore";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import type { SyncedSentence } from "@/types/analysis";

export function ScriptView({
  sentences,
  colorCoded,
  legend,
}: {
  sentences: SyncedSentence[];
  colorCoded: boolean;
  legend?: string;
}) {
  const currentTime = useAudioPlayerStore((s) => s.currentTime);
  const strings = useStrings();

  return (
    <View style={styles.container}>
      {legend ? <Text style={styles.legend}>{legend}</Text> : null}
      {sentences.length === 0 ? (
        <Text style={styles.empty}>{strings.noSentenceData}</Text>
      ) : (
        sentences.map((sentence, index) => (
          <ScriptSentenceRow
            key={`${sentence.startTime}-${index}`}
            sentence={sentence}
            isActive={currentTime >= sentence.startTime && currentTime < sentence.endTime}
            colorCoded={colorCoded}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 2,
  },
  legend: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.xs },
  empty: { ...typography.bodySm, color: colors.textTertiary },
});
