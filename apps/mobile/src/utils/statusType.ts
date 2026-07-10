import type { StatusTone } from "@/types/analysis";

export function scoreToTone(score: number): StatusTone {
  if (score >= 70) return "success";
  if (score >= 40) return "warning";
  return "error";
}
