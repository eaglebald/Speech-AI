import type { BadgeTone } from "@/components/ui/Badge";

export type StatusTone = BadgeTone;

// Shared shape consumed by ScriptView/ScriptSentenceRow regardless of which
// metric (pace vs energy) the sentence array came from.
export type SyncedSentence = {
  text: string;
  startTime: number;
  endTime: number;
  status: string;
};

export type PaceSentence = SyncedSentence & { status: "fast" | "slow" | "stable" };
export type EnergySentence = SyncedSentence & { status: "high" | "low" | "stable" };

export type PaceMetric = {
  wpm: number;
  statusLabel: string;
  tone: StatusTone;
  description: string;
  sentences: PaceSentence[];
};

export type EnergyMetric = {
  score: number;
  title: string;
  tone: StatusTone;
  description: string;
  sentences: EnergySentence[];
};

export type FillerWord = { word: string; timestamp: string };

export type FillerWordsMetric = {
  count: number;
  tone: StatusTone;
  words: FillerWord[];
  tip: string;
};

export type ContentLogicMetric = {
  statusLabel: string;
  tone: StatusTone;
  strengthTitle: string;
  strengthDescription: string;
  tipTitle: string;
  tipDescription: string;
};

export type FeedbackResult = {
  globalScore: number;
  statusLabel: string;
  summary: string;
  pace: PaceMetric;
  energy: EnergyMetric;
  fillerWords: FillerWordsMetric;
  contentLogic: ContentLogicMetric;
};
