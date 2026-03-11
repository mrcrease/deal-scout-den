import { Tier } from '@/data/mock';

const tierStyles: Record<Tier, string> = {
  A: 'bg-tier-a/15 text-tier-a border-tier-a/30',
  B: 'bg-tier-b/15 text-tier-b border-tier-b/30',
  C: 'bg-tier-c/15 text-tier-c border-tier-c/30',
  D: 'bg-tier-d/15 text-tier-d border-tier-d/30',
};

export function TierBadge({ tier }: { tier: Tier }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${tierStyles[tier]}`}>
      {tier}
    </span>
  );
}
