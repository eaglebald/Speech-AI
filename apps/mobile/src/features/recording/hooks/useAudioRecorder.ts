import { Audio } from "expo-av";
import { useCallback, useEffect, useRef, useState } from "react";

import { MAX_RECORDING_SECONDS } from "@/constants/recording";

export type RecorderStatus = "idle" | "recording" | "stopped" | "error";

export function useAudioRecorder({ onAutoStop }: { onAutoStop?: (uri: string | null) => void } = {}) {
  const recordingRef = useRef<Audio.Recording | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [captureWarning, setCaptureWarning] = useState<string | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const stop = useCallback(async (): Promise<string | null> => {
    clearTimer();
    setStatus("stopped");
    const recording = recordingRef.current;
    recordingRef.current = null;
    if (!recording) return null;
    try {
      await recording.stopAndUnloadAsync();
      return recording.getURI();
    } catch {
      return null;
    }
  }, [clearTimer]);

  const start = useCallback(async () => {
    setElapsedSeconds(0);
    setCaptureWarning(null);
    setStatus("recording");

    // Best-effort real capture. The iOS Simulator has no microphone input by default,
    // so createAsync can fail there — the on-screen timer/waveform keep running either
    // way so the UI flow stays testable. On a real device this records actual audio.
    try {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      recordingRef.current = recording;
    } catch {
      setCaptureWarning("이 환경에서는 실제 오디오 캡처가 지원되지 않습니다 (실기기에서는 정상 동작합니다).");
    }

    intervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        if (next >= MAX_RECORDING_SECONDS) {
          clearTimer();
          stop().then((uri) => onAutoStop?.(uri));
        }
        return next;
      });
    }, 1000);
  }, [clearTimer, onAutoStop, stop]);

  useEffect(() => clearTimer, [clearTimer]);

  return { status, elapsedSeconds, captureWarning, start, stop };
}
