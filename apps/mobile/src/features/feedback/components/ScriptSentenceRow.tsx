import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text } from "react-native";

import { colors } from "@/theme/colors";
import { radii } from "@/theme/radii";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import type { SyncedSentence } from "@/types/analysis";

export function ScriptSentenceRow({
  sentence,
  isActive,
  colorCoded,
}: {
  sentence: SyncedSentence;
  isActive: boolean;
  colorCoded: boolean;
}) {
  const highlightOpacity = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(highlightOpacity, {
      toValue: isActive ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isActive, highlightOpacity]);

  // "high"/"fast" -> red (too much), "low"/"slow" -> blue (too little), else default.
  const textColor = !colorCoded
    ? colors.textPrimary
    : sentence.status === "high" || sentence.status === "fast"
      ? colors.error
      : sentence.status === "low" || sentence.status === "slow"
        ? colors.primary
        : colors.textPrimary;

  return (
    <Animated.View style={styles.row}>
      <Animated.View style={[styles.highlight, { opacity: highlightOpacity }]} />
      <Text style={[styles.text, { color: textColor }]}>{sentence.text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    position: "relative",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.sm,
    marginBottom: 2,
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  highlight: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.surfaceMuted,
  },
  text: { ...typography.bodySm, lineHeight: 22 },
});
