import { create } from "zustand";

type AudioPlayerState = {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsPlaying: (playing: boolean) => void;
  reset: () => void;
  // Real seek+play implementation is registered by useAudioPlayback (the
  // component that owns the expo-av Sound). Any component — the player bar,
  // a filler-word chip, a script sentence — can call this to jump to a
  // timestamp and start playback immediately, without prop drilling.
  seekAndPlay: (seconds: number) => void;
  setSeekAndPlay: (fn: (seconds: number) => void) => void;
};

// Shared across the Feedback screen: useAudioPlayback drives this from the
// real expo-av Sound's status updates, and every ScriptView (Pace, Energy)
// reads the same currentTime to decide which sentence is active — one source
// of truth keeps play and seek perfectly in sync everywhere, regardless of
// which component (button vs scrubber vs chip) triggered the change.
export const useAudioPlayerStore = create<AudioPlayerState>((set) => ({
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  reset: () => set({ currentTime: 0, duration: 0, isPlaying: false }),
  seekAndPlay: () => {},
  setSeekAndPlay: (fn) => set({ seekAndPlay: fn }),
}));
