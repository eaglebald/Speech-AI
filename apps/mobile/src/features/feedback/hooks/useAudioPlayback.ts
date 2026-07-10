import { Audio, type AVPlaybackStatus } from "expo-av";
import { useCallback, useEffect, useRef } from "react";

import { useAudioPlayerStore } from "@/store/audioPlayerStore";

// Owns the real expo-av Sound object for the Feedback screen's recording
// playback. Position/duration/isPlaying are pushed into the shared store on
// every native status update, so Pace/Energy ScriptViews stay in sync
// whether the user pressed play, dragged the scrubber, or tapped a filler-word
// chip. seekAndPlay is additionally registered into the store so any
// descendant (e.g. FillerWordsCard) can trigger "jump + play" without prop drilling.
export function useAudioPlayback(audioUrl: string | null) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const setCurrentTime = useAudioPlayerStore((s) => s.setCurrentTime);
  const setDuration = useAudioPlayerStore((s) => s.setDuration);
  const setIsPlaying = useAudioPlayerStore((s) => s.setIsPlaying);
  const reset = useAudioPlayerStore((s) => s.reset);
  const setSeekAndPlay = useAudioPlayerStore((s) => s.setSeekAndPlay);

  useEffect(() => {
    let isMounted = true;
    reset();

    if (!audioUrl) return;

    const onStatus = (status: AVPlaybackStatus) => {
      if (!status.isLoaded) return;
      setCurrentTime((status.positionMillis ?? 0) / 1000);
      if (status.durationMillis) setDuration(status.durationMillis / 1000);
      setIsPlaying(status.isPlaying);
    };

    Audio.Sound.createAsync({ uri: audioUrl }, { shouldPlay: false }, onStatus)
      .then(({ sound }) => {
        if (!isMounted) {
          sound.unloadAsync();
          return;
        }
        soundRef.current = sound;
      })
      .catch(() => {
        // Playback unavailable (e.g. signed URL expired) — bar stays inert; no crash.
      });

    return () => {
      isMounted = false;
      soundRef.current?.unloadAsync();
      soundRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioUrl]);

  const togglePlay = async () => {
    const sound = soundRef.current;
    if (!sound) return;
    const status = await sound.getStatusAsync();
    if (!status.isLoaded) return;
    if (status.isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const seekTo = async (seconds: number) => {
    const sound = soundRef.current;
    if (!sound) return;
    await sound.setPositionAsync(Math.max(0, seconds) * 1000);
  };

  const seekAndPlay = useCallback(async (seconds: number) => {
    const sound = soundRef.current;
    if (!sound) return;
    await sound.setPositionAsync(Math.max(0, seconds) * 1000);
    await sound.playAsync();
  }, []);

  useEffect(() => {
    setSeekAndPlay(seekAndPlay);
    return () => setSeekAndPlay(() => {});
  }, [seekAndPlay, setSeekAndPlay]);

  return { togglePlay, seekTo, seekAndPlay };
}
