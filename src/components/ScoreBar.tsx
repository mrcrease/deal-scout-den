interface ScoreBarProps {
  score: number;
  max?: number;
}

export function ScoreBar({ score, max = 100 }: ScoreBarProps) {
  const pct = Math.min((score / max) * 100, 100);
  const color = score >= 50
    ? 'bg-tier-a'
    : score >= 30
    ? 'bg-tier-b'
    : score >= 15
    ? 'bg-tier-c'
    : 'bg-tier-d';

  return (
    <div className="flex items-center gap-2">
      <span className={`font-mono-num font-bold text-sm w-7 text-right ${
        score >= 50 ? 'text-tier-a' : score >= 30 ? 'text-tier-b' : 'text-tier-c'
      }`}>
        {score}
      </span>
      <div className="w-16 h-1.5 rounded-full bg-border overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
