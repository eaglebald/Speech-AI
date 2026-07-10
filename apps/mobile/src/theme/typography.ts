export const typography = {
  headlineXl: { fontSize: 32, fontWeight: "800" as const, lineHeight: 40 },
  headlineLg: { fontSize: 24, fontWeight: "700" as const, lineHeight: 32 },
  scoreDisplay: { fontSize: 40, fontWeight: "800" as const, lineHeight: 48 },
  timerMono: {
    fontSize: 40,
    fontWeight: "700" as const,
    lineHeight: 48,
    fontVariant: ["tabular-nums"] as Array<"tabular-nums">,
  },
  subheading: { fontSize: 17, fontWeight: "600" as const, lineHeight: 24 },
  bodyMd: { fontSize: 15, fontWeight: "400" as const, lineHeight: 22 },
  bodySm: { fontSize: 13, fontWeight: "400" as const, lineHeight: 18 },
  labelCaps: { fontSize: 11, fontWeight: "700" as const, lineHeight: 14, letterSpacing: 0.6 },
  caption: { fontSize: 12, fontWeight: "500" as const, lineHeight: 16 },
};
