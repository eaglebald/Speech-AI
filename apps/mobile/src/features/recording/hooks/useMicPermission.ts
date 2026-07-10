import { Audio } from "expo-av";
import { useCallback, useEffect, useState } from "react";

// 기획서 1.1.5: 앱 초기 실행 시 마이크 접근 권한을 요청하고, 거부 시 호출부에서 설정 유도 메시지를 표시한다.
export function useMicPermission() {
  const [granted, setGranted] = useState<boolean | null>(null);

  const request = useCallback(async () => {
    const { status } = await Audio.requestPermissionsAsync();
    const isGranted = status === "granted";
    setGranted(isGranted);
    return isGranted;
  }, []);

  useEffect(() => {
    request();
  }, [request]);

  return { granted, request };
}
