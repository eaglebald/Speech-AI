export function formatMMSS(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// Parses backend timestamp strings like "0:10s" / "1:02s" (M:SS, optional
// trailing "s") into seconds. Returns 0 if the string doesn't match.
export function parseTimestampToSeconds(text: string): number {
  const match = text.trim().match(/^(\d+):(\d+)/);
  if (!match) return 0;
  const minutes = Number(match[1]);
  const seconds = Number(match[2]);
  return minutes * 60 + seconds;
}
