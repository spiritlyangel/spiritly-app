// The user's real Formation Stage: the median of recent assessments.
// One unusually open morning should not promote them; one flat day
// should not demote them.

export function rollingStage(assessments: number[], fallback = 1): number {
  const recent = assessments.filter((n) => typeof n === 'number').slice(0, 5);
  if (recent.length < 3) return fallback; // not enough evidence yet
  const sorted = [...recent].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}