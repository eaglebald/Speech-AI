import { useEffect, useRef, useState } from "react";

import { getAnalysisStatus, type AnalysisStatus } from "@/api/analysis";
import type { FeedbackResult } from "@/types/analysis";

const POLL_INTERVAL_MS = 1200;

export function useAnalysisPolling(recordingId: string | undefined) {
  const [status, setStatus] = useState<AnalysisStatus>("uploaded");
  const [result, setResult] = useState<FeedbackResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const stoppedRef = useRef(false);

  useEffect(() => {
    if (!recordingId) return;
    stoppedRef.current = false;

    const poll = async () => {
      try {
        const res = await getAnalysisStatus(recordingId);
        if (stoppedRef.current) return;

        setStatus(res.status);
        if (res.status === "completed") {
          setResult(res.result);
          return;
        }
        if (res.status === "failed") {
          setError(res.error ?? "분석에 실패했습니다.");
          return;
        }
        setTimeout(poll, POLL_INTERVAL_MS);
      } catch {
        if (stoppedRef.current) return;
        setError("서버와 통신할 수 없습니다.");
      }
    };

    poll();
    return () => {
      stoppedRef.current = true;
    };
  }, [recordingId]);

  return { status, result, error };
}
