import { BarChart3, Filter, Mail, Settings, RefreshCw } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { companies, pipelineCounts } from '@/data/mock';

const navItems = [
  { title: 'Overview', url: '/', icon: BarChart3 },
  { title: 'Pipeline', url: '/pipeline', icon: Filter },
  { title: 'Outreach', url: '/outreach', icon: Mail },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const totalCompanies = Object.values(pipelineCounts).reduce((a, b) => a + b, 0);
  const priorityAB = companies.filter(c => c.tier === 'A' || c.tier === 'B').length;
  const awaitingApproval = companies.filter(c => c.status === 'SCORED').length;
  const lettersSent = companies.filter(c => c.status === 'LETTER_SENT').length;

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-lg font-bold tracking-wider text-foreground">STRVRS</h1>
        <p className="text-xs text-muted-foreground tracking-wide">Deal Radar</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.url === '/'}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
            activeClassName="bg-sidebar-accent text-foreground"
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
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
      <div className="px-5 pb-3 space-y-1.5 text-xs">
        <div className="flex justify-between text-muted-foreground">
          <span>Total Companies</span>
          <span className="font-mono-num text-foreground">{totalCompanies.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Priority A/B</span>
          <span className="font-mono-num text-foreground">{priorityAB}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Awaiting Approval</span>
          <span className="font-mono-num text-foreground">{awaitingApproval}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Letters Sent</span>
          <span className="font-mono-num text-foreground">{lettersSent}</span>
        </div>
      </div>

      {/* Refresh */}
      <div className="px-3 pb-4">
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-sidebar-accent border border-sidebar-border transition-colors">
          <RefreshCw className="h-3 w-3" />
          Refresh
        </button>
      </div>
    </aside>
  );
}
