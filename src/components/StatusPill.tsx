import { CompanyStatus } from '@/data/mock';

const statusStyles: Record<CompanyStatus, string> = {
  NEW: 'bg-muted text-muted-foreground',
  ENRICHED: 'bg-indigo/15 text-indigo',
  SCORED: 'bg-tier-b/15 text-tier-b',
  APPROVED: 'bg-primary/15 text-primary',
  LETTER_SENT: 'bg-emerald/15 text-emerald',
  EXCLUDED: 'bg-destructive/15 text-destructive',
};

export function StatusPill({ status }: { status: CompanyStatus }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
