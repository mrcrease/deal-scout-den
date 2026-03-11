import { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: string;
  onClick?: () => void;
  icon?: ReactNode;
  accent?: 'primary' | 'emerald' | 'tier-a' | 'tier-b' | 'violet';
}

export function MetricCard({ label, value, delta, onClick, icon, accent = 'primary' }: MetricCardProps) {
  const accentColors: Record<string, string> = {
    primary: 'from-primary/40 to-primary/0',
    emerald: 'from-emerald/40 to-emerald/0',
    'tier-a': 'from-tier-a/40 to-tier-a/0',
    'tier-b': 'from-tier-b/40 to-tier-b/0',
    violet: 'from-violet/40 to-violet/0',
  };

  return (
    <div
      onClick={onClick}
      className={`relative bg-card border border-border rounded-lg p-4 overflow-hidden group transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-primary/40 hover:shadow-[0_0_20px_-6px_hsl(var(--primary)/0.2)]' : 'hover:border-border/80'
      }`}
    >
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${accentColors[accent]} opacity-60 group-hover:opacity-100 transition-opacity`} />
      
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
        {icon && <span className="text-muted-foreground group-hover:text-primary transition-colors">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold font-mono-num text-foreground">{value}</span>
        {delta && (
          <span className="text-xs font-mono-num text-emerald bg-emerald/10 px-1.5 py-0.5 rounded">
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}
