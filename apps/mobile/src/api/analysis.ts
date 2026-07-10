import { apiClient } from "@/api/client";
import type { FeedbackResult } from "@/types/analysis";

export type AnalysisStatus = "uploaded" | "analyzing" | "completed" | "failed";

export type AnalysisStatusResponse = {
  recordingId: string;
  status: AnalysisStatus;
  result: FeedbackResult | null;
  error: string | null;
  audioUrl: string | null;
};

export async function getAnalysisStatus(recordingId: string): Promise<AnalysisStatusResponse> {
  const { data } = await apiClient.get<AnalysisStatusResponse>(`/analysis/${recordingId}`);
  return data;
}
