import { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: string;
  onClick?: () => void;
  icon?: ReactNode;
}

export function MetricCard({ label, value, delta, onClick, icon }: MetricCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-card border border-border rounded-lg p-4 ${onClick ? 'cursor-pointer hover:border-primary/40 transition-colors' : ''}`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        {icon}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold font-mono-num text-foreground">{value}</span>
        {delta && <span className="text-xs font-mono-num text-emerald">{delta}</span>}
      </div>
    </div>
  );
}
