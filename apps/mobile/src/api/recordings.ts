import { apiClient } from "@/api/client";
import type { Purpose } from "@/store/profileStore";

export type UploadRecordingResponse = {
  recording_id: string;
  status: string;
  duration_seconds: number;
  uploaded_at: string;
};

export async function uploadRecording(
  fileUri: string,
  options?: { mimeType?: string; language?: "ko" | "en"; purpose?: Purpose; name?: string },
): Promise<UploadRecordingResponse> {
  const mimeType = options?.mimeType ?? "audio/m4a";
  const language = options?.language ?? "ko";
  const purpose = options?.purpose ?? "general_speaking";
  const name = options?.name ?? "";

  const formData = new FormData();
  const extension = mimeType.includes("wav") ? "wav" : "m4a";
  formData.append("file", {
    uri: fileUri,
    name: `recording.${extension}`,
    type: mimeType,
  } as unknown as Blob);
  formData.append("language", language);
  formData.append("purpose", purpose);
  formData.append("name", name);

  const { data } = await apiClient.post<UploadRecordingResponse>("/recordings", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export type RecordingListItem = {
  recordingId: string;
  status: string;
  createdAt: string;
  durationSeconds: number;
  globalScore: number | null;
  statusLabel: string | null;
  summary: string | null;
};

export async function listRecordings(limit = 20): Promise<RecordingListItem[]> {
  const { data } = await apiClient.get<{ items: RecordingListItem[] }>("/recordings", {
    params: { limit },
  });
  return data.items;
}

export async function deleteRecording(recordingId: string): Promise<void> {
  await apiClient.delete(`/recordings/${recordingId}`);
}
