import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { colors } from "@/theme/colors";

const BAR_COUNT = 32;
const IDLE_HEIGHT = 6;

// Mocked visualization (기획서: "Mocking 가능") — randomized bar heights while
// recording is active, independent of whether real audio capture succeeded.
export function Waveform({ active }: { active: boolean }) {
  const [heights, setHeights] = useState<number[]>(() => Array.from({ length: BAR_COUNT }, () => IDLE_HEIGHT));

  useEffect(() => {
    if (!active) {
      setHeights(Array.from({ length: BAR_COUNT }, () => IDLE_HEIGHT));
      return;
    }
    const id = setInterval(() => {
      setHeights(Array.from({ length: BAR_COUNT }, () => IDLE_HEIGHT + Math.random() * 42));
    }, 120);
    return () => clearInterval(id);
  }, [active]);

  return (
    <View style={styles.row}>
      {heights.map((h, i) => (
        <View key={i} style={[styles.bar, { height: h }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    height: 56,
  },
  bar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
});
