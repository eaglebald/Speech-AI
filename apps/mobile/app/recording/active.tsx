import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { uploadRecording } from "@/api/recordings";
import { Badge } from "@/components/ui/Badge";
import {
  MAX_RECORDING_SECONDS,
  RECOMMENDED_MAX_SECONDS,
  RECOMMENDED_MIN_SECONDS,
} from "@/constants/recording";
import { AppHeader } from "@/features/recording/components/AppHeader";
import { RecordingProgressBar } from "@/features/recording/components/RecordingProgressBar";
import { StopButton } from "@/features/recording/components/StopButton";
import { Waveform } from "@/features/recording/components/Waveform";
import { useAudioRecorder } from "@/features/recording/hooks/useAudioRecorder";
import { useMicPermission } from "@/features/recording/hooks/useMicPermission";
import { useStrings } from "@/i18n/strings";
import { useLanguageStore } from "@/store/languageStore";
import { useProfileStore } from "@/store/profileStore";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { formatMMSS } from "@/utils/formatTime";

export default function ActiveRecordingScreen() {
  const router = useRouter();
  const strings = useStrings();
  const { request } = useMicPermission();
  const startedRef = useRef(false);
  const [isUploading, setIsUploading] = useState(false);

  const uploadAndNavigate = async (uri: string | null) => {
    if (!uri) {
      Alert.alert(strings.noRecordingTitle, strings.noRecordingMessage, [
        { text: strings.confirm, onPress: () => router.back() },
      ]);
      return;
    }
    setIsUploading(true);
    try {
      const language = useLanguageStore.getState().language;
      const { purpose, name } = useProfileStore.getState();
      const upload = await uploadRecording(uri, {
        language,
        purpose: purpose ?? "general_speaking",
        name,
      });
      router.replace(`/analysis/loading?recordingId=${upload.recording_id}`);
    } catch {
      setIsUploading(false);
      Alert.alert(strings.uploadFailedTitle, strings.uploadFailedMessage, [
        { text: strings.confirm, onPress: () => router.back() },
      ]);
    }
  };

  const { status, elapsedSeconds, captureWarning, start, stop } = useAudioRecorder({
    onAutoStop: uploadAndNavigate,
  });

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    (async () => {
      const isGranted = await request();
      if (!isGranted) {
        Alert.alert(strings.micPermissionTitle, strings.micPermissionMessage, [
          { text: strings.confirm, onPress: () => router.back() },
        ]);
        return;
      }
      start();
    })();
  }, [request, router, start]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  const handleStop = async () => {
    const uri = await stop();
    await uploadAndNavigate(uri);
  };

  const milestone =
    elapsedSeconds >= RECOMMENDED_MAX_SECONDS
      ? { label: strings.milestoneRecommended, tone: "warning" as const }
      : elapsedSeconds >= RECOMMENDED_MIN_SECONDS
        ? { label: strings.milestoneOneMinute, tone: "success" as const }
        : null;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <AppHeader />

        <View style={styles.centerBlock}>
          <View style={styles.badgeSlot}>
            {milestone ? <Badge label={milestone.label} tone={milestone.tone} /> : null}
          </View>

          <Text style={styles.timerLabel}>{strings.recordingTime}</Text>
          <Text style={styles.timer}>{formatMMSS(elapsedSeconds)}</Text>

          <Waveform active={status === "recording"} />

          <RecordingProgressBar elapsedSeconds={elapsedSeconds} limitSeconds={RECOMMENDED_MAX_SECONDS} />

          <Text style={styles.hardLimitNote}>{strings.hardLimitNote(Math.floor(MAX_RECORDING_SECONDS / 60))}</Text>

          {captureWarning ? <Text style={styles.warning}>{captureWarning}</Text> : null}
        </View>

        <View style={styles.stopSection}>
          {isUploading ? (
            <View style={styles.uploadingBlock}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.uploadingText}>{strings.uploadingText}</Text>
            </View>
          ) : (
            <StopButton onPress={handleStop} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: spacing.lg, justifyContent: "space-between" },
  centerBlock: { alignItems: "center", gap: spacing.md, marginTop: spacing.xl },
  badgeSlot: { height: 28, justifyContent: "center" },
  timerLabel: { ...typography.labelCaps, color: colors.textTertiary },
  timer: { ...typography.timerMono, color: colors.textPrimary },
  hardLimitNote: { ...typography.caption, color: colors.textTertiary, textAlign: "center" },
  warning: { ...typography.bodySm, color: colors.warning, textAlign: "center", paddingHorizontal: spacing.lg },
  uploadingBlock: { alignItems: "center", gap: spacing.sm, height: 72, justifyContent: "center" },
  uploadingText: { ...typography.labelCaps, color: colors.textSecondary },
  stopSection: { alignItems: "center", marginBottom: spacing.lg },
});
