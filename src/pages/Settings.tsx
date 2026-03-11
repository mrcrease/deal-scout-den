import { CheckCircle2, AlertTriangle } from 'lucide-react';

const prioritySectors = [
  'Facilities Support', 'Commercial Cleaning', 'Window Cleaning', 'Specialist Cleaning',
  'Pest Control', 'Grounds Maintenance', 'Waste Collection', 'Materials Recovery',
  'Electrical Installation', 'Plumbing & HVAC',
];

const secondarySectors = [
  'Freight Transport', 'Metal Products Repair', 'Machinery Repair', 'Electrical Equipment Repair',
];

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6 max-w-[1000px]">
      <h2 className="text-xl font-semibold text-foreground">Settings</h2>

      <div className="grid grid-cols-1 gap-4">
        {/* Pipeline Throughput */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-medium text-foreground mb-3">Pipeline Throughput</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <InfoRow label="Enrichment" value="3,000 / run" />
            <InfoRow label="Accounts" value="500 / run" />
            <InfoRow label="Frequency" value="Every 4 hours" />
          </div>
        </div>

        {/* Scoring Thresholds */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-medium text-foreground mb-3">Scoring Thresholds</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <InfoRow label="Tier A" value="≥ 50 pts" />
            <InfoRow label="Tier B" value="≥ 30 pts" />
            <InfoRow label="Tier C" value="≥ 15 pts" />
            <InfoRow label="Director age" value="55–75 years" />
            <InfoRow label="Company age" value="≥ 10 years" />
            <InfoRow label="Revenue" value="£500k–£5m" />
          </div>
        </div>

        {/* API Status */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-medium text-foreground mb-3">API Status</h3>
          <div className="space-y-2.5">
            <StatusRow icon={<CheckCircle2 className="h-4 w-4 text-emerald" />} label="Companies House" status="Configured" ok />
            <StatusRow icon={<AlertTriangle className="h-4 w-4 text-tier-b" />} label="Stannp" status="Test mode — letters will NOT be posted" />
            <StatusRow icon={<AlertTriangle className="h-4 w-4 text-tier-b" />} label="Operator phone" status="Not set" />
          </div>
        </div>

        {/* Approved Sectors */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-medium text-foreground mb-3">Approved Sectors</h3>
          <div className="mb-3">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Priority</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {prioritySectors.map(s => (
                <span key={s} className="px-2.5 py-1 rounded text-xs bg-emerald/10 text-emerald border border-emerald/20">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Secondary</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {secondarySectors.map(s => (
                <span key={s} className="px-2.5 py-1 rounded text-xs bg-primary/10 text-primary border border-primary/20">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-muted-foreground">{label}</span>
      <p className="text-sm font-mono-num text-foreground">{value}</p>
    </div>
  );
}

function StatusRow({ icon, label, status, ok }: { icon: React.ReactNode; label: string; status: string; ok?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm text-foreground w-40">{label}</span>
      <span className={`text-sm ${ok ? 'text-emerald' : 'text-tier-b'}`}>{status}</span>
    </div>
  );
}
