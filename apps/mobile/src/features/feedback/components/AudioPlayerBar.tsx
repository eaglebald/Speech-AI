import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Scrubber } from "@/features/feedback/components/Scrubber";
import { useAudioPlayback } from "@/features/feedback/hooks/useAudioPlayback";
import { useAudioPlayerStore } from "@/store/audioPlayerStore";
import { colors } from "@/theme/colors";
import { radii } from "@/theme/radii";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { formatMMSS } from "@/utils/formatTime";

export function AudioPlayerBar({ audioUrl }: { audioUrl: string | null }) {
  const { togglePlay, seekTo } = useAudioPlayback(audioUrl);

  const currentTime = useAudioPlayerStore((s) => s.currentTime);
  const duration = useAudioPlayerStore((s) => s.duration);
  const isPlaying = useAudioPlayerStore((s) => s.isPlaying);

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <View style={styles.bar}>
      <Pressable style={[styles.playButton, !audioUrl && styles.playButtonDisabled]} onPress={togglePlay} hitSlop={8} disabled={!audioUrl}>
        <Ionicons name={isPlaying ? "pause" : "play"} size={18} color={colors.onPrimary} />
      </Pressable>
      <View style={styles.body}>
        <Scrubber progress={progress} onSeekRatio={(ratio) => seekTo(ratio * duration)} />
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatMMSS(Math.floor(currentTime))}</Text>
          <Text style={styles.timeText}>{formatMMSS(Math.floor(duration))}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  playButtonDisabled: { opacity: 0.4 },
  body: { flex: 1, gap: 2 },
  timeRow: { flexDirection: "row", justifyContent: "space-between" },
  timeText: { ...typography.caption, color: colors.textTertiary },
});
