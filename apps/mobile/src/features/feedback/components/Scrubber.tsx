import { useRef, useState } from "react";
import { PanResponder, StyleSheet, View } from "react-native";

import { colors } from "@/theme/colors";
import { radii } from "@/theme/radii";

function clamp(value: number) {
  return Math.max(0, Math.min(1, value || 0));
}

export function Scrubber({ progress, onSeekRatio }: { progress: number; onSeekRatio: (ratio: number) => void }) {
  const widthRef = useRef(1);
  const [dragging, setDragging] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setDragging(true);
        onSeekRatio(clamp(evt.nativeEvent.locationX / widthRef.current));
      },
      onPanResponderMove: (evt) => {
        onSeekRatio(clamp(evt.nativeEvent.locationX / widthRef.current));
      },
      onPanResponderRelease: () => setDragging(false),
      onPanResponderTerminate: () => setDragging(false),
    }),
  ).current;

  const displayRatio = clamp(progress);

  return (
    <View
      style={styles.hitArea}
      onLayout={(e) => {
        widthRef.current = e.nativeEvent.layout.width || 1;
      }}
      {...panResponder.panHandlers}
    >
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${displayRatio * 100}%` }]} />
      </View>
      <View style={[styles.thumb, { left: `${displayRatio * 100}%` }, dragging && styles.thumbActive]} />
    </View>
  );
}

const styles = StyleSheet.create({
  hitArea: { justifyContent: "center", paddingVertical: 10 },
  track: { height: 4, borderRadius: radii.full, backgroundColor: colors.surfaceMuted, overflow: "hidden" },
  fill: { height: "100%", backgroundColor: colors.primary, borderRadius: radii.full },
  thumb: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    marginLeft: -7,
    top: 8,
    backgroundColor: colors.primary,
  },
  thumbActive: { transform: [{ scale: 1.3 }] },
});
