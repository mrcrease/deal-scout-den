import { BarChart3, Filter, Mail, Settings, RefreshCw } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { companies, pipelineCounts } from '@/data/mock';

const totalCompanies = Object.values(pipelineCounts).reduce((a, b) => a + b, 0);
const priorityAB = companies.filter(c => c.tier === 'A' || c.tier === 'B').length;
const awaitingApproval = companies.filter(c => c.status === 'SCORED').length;
const lettersSent = companies.filter(c => c.status === 'LETTER_SENT').length;
const approvedPending = companies.filter(c => c.status === 'APPROVED').length;

const navItems = [
  { title: 'Overview', url: '/', icon: BarChart3, badge: null },
  { title: 'Pipeline', url: '/pipeline', icon: Filter, badge: awaitingApproval > 0 ? awaitingApproval : null, badgeColor: 'bg-tier-b/20 text-tier-b' },
  { title: 'Outreach', url: '/outreach', icon: Mail, badge: approvedPending > 0 ? approvedPending : null, badgeColor: 'bg-primary/20 text-primary' },
  { title: 'Settings', url: '/settings', icon: Settings, badge: null },
];

export function AppSidebar() {
  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <h1 className="text-lg font-bold tracking-[0.2em] text-foreground">STRVRS</h1>
        <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase mt-0.5">Deal Radar</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.url === '/'}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-all duration-150"
            activeClassName="bg-sidebar-accent text-foreground shadow-[inset_2px_0_0_hsl(var(--primary))]"
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="flex-1">{item.title}</span>
            {item.badge !== null && (
              <span className={`text-[10px] font-mono-num font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${item.badgeColor}`}>
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-4 border-t border-sidebar-border" />

      {/* Status */}
      <div className="px-5 py-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="h-2 w-2 rounded-full bg-emerald animate-pulse-dot" />
          <span className="text-muted-foreground">Enriching...</span>
        </div>
      </div>

      {/* Mini metrics */}
      <div className="px-5 pb-3 space-y-2 text-xs">
        <MiniMetric label="Total Companies" value={totalCompanies.toLocaleString()} />
        <MiniMetric label="Priority A/B" value={priorityAB.toString()} highlight />
        <MiniMetric label="Awaiting Approval" value={awaitingApproval.toString()} warn={awaitingApproval > 0} />
        <MiniMetric label="Letters Sent" value={lettersSent.toString()} />
      </div>

      {/* Refresh */}
      <div className="px-3 pb-4">
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-sidebar-accent border border-sidebar-border transition-all duration-150 active:scale-[0.98]">
          <RefreshCw className="h-3 w-3" />
          Refresh
        </button>
      </div>
    </aside>
  );
}

function MiniMetric({ label, value, highlight, warn }: { label: string; value: string; highlight?: boolean; warn?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-mono-num ${warn ? 'text-tier-b font-semibold' : highlight ? 'text-primary' : 'text-foreground'}`}>
        {value}
      </span>
    </div>
  );
}
