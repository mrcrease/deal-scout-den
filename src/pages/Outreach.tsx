import { useState } from 'react';
import { companies, Company, formatRevenue, ResponseStatus } from '@/data/mock';
import { MetricCard } from '@/components/MetricCard';
import { TierBadge } from '@/components/TierBadge';
import { Mail, Clock, TrendingUp, Send, CalendarClock } from 'lucide-react';

const responseIcons: Record<string, string> = {
  INTERESTED: '🟢',
  CALLBACK: '📞',
  '2ND_LETTER_DUE': '📬',
  AWAITING: '⏳',
  COLD: '❄️',
  NOT_INTERESTED: '🚫',
};

const responseBorderColors: Record<string, string> = {
  INTERESTED: 'border-l-emerald',
  CALLBACK: 'border-l-primary',
  '2ND_LETTER_DUE': 'border-l-violet',
  AWAITING: 'border-l-tier-b',
  COLD: 'border-l-tier-d',
  NOT_INTERESTED: 'border-l-destructive',
};

const responseOrder: ResponseStatus[] = ['INTERESTED', 'CALLBACK', '2ND_LETTER_DUE', 'AWAITING', 'COLD', 'NOT_INTERESTED'];

export default function Outreach() {
  const [activeTab, setActiveTab] = useState<'approved' | 'sent' | 'responses'>('approved');
  const approved = companies.filter(c => c.status === 'APPROVED');
  const sent = companies.filter(c => c.status === 'LETTER_SENT');
  const interested = sent.filter(c => c.responseStatus === 'INTERESTED').length;
  const followupsDue = sent.filter(c => c.followUpDate && new Date(c.followUpDate) <= new Date()).length;

  const tabs = [
    { id: 'approved' as const, label: `Approved (${approved.length})` },
    { id: 'sent' as const, label: `Sent (${sent.length})` },
    { id: 'responses' as const, label: 'Responses' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1400px] animate-fade-in">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Outreach Tracker</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Manage letters, follow-ups, and responses.</p>
      </div>

      <div className="grid grid-cols-5 gap-3">
        <MetricCard label="Approved Pending" value={approved.length} accent="primary" icon={<Clock className="h-3.5 w-3.5" />} />
        <MetricCard label="Letters Sent" value={sent.length} icon={<Send className="h-3.5 w-3.5" />} />
        <MetricCard label="Follow-ups Due" value={followupsDue} accent="tier-b" icon={<CalendarClock className="h-3.5 w-3.5" />} />
        <MetricCard label="Interested" value={interested} accent="emerald" icon={<TrendingUp className="h-3.5 w-3.5" />} />
        <MetricCard label="2nd Letter Due" value={0} icon={<Mail className="h-3.5 w-3.5" />} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2.5 text-sm transition-all duration-150 border-b-2 -mb-px ${
              activeTab === t.id ? 'border-primary text-foreground font-medium' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'approved' && <ApprovedTable companies={approved} />}
      {activeTab === 'sent' && <SentTable companies={sent} />}
      {activeTab === 'responses' && <ResponseCards companies={sent} />}
    </div>
  );
}

function ApprovedTable({ companies }: { companies: Company[] }) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-[10px] text-muted-foreground uppercase tracking-wider">
            <th className="py-2.5 px-3 text-left">Company</th>
            <th className="py-2.5 px-3 text-left">Sector</th>
            <th className="py-2.5 px-3 text-left">Director</th>
            <th className="py-2.5 px-3 text-center">Tier</th>
            <th className="py-2.5 px-3 text-left">Location</th>
            <th className="py-2.5 px-3 text-right">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {companies.map(c => (
            <tr key={c.id} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
              <td className="py-2.5 px-3 font-medium text-foreground">{c.name}</td>
              <td className="py-2.5 px-3 text-muted-foreground text-xs">{c.sector}</td>
              <td className="py-2.5 px-3 text-muted-foreground text-xs">{c.director}</td>
              <td className="py-2.5 px-3 text-center"><TierBadge tier={c.tier} /></td>
              <td className="py-2.5 px-3 text-muted-foreground text-xs">{c.location}</td>
              <td className="py-2.5 px-3 text-right font-mono-num text-muted-foreground">{formatRevenue(c.revenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SentTable({ companies }: { companies: Company[] }) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-[10px] text-muted-foreground uppercase tracking-wider">
            <th className="py-2.5 px-3 text-left">Company</th>
            <th className="py-2.5 px-3 text-left">Director</th>
            <th className="py-2.5 px-3 text-left">Sent Date</th>
            <th className="py-2.5 px-3 text-left">Follow-up</th>
            <th className="py-2.5 px-3 text-center">Response</th>
          </tr>
        </thead>
        <tbody>
          {companies.map(c => {
            const isOverdue = c.followUpDate && new Date(c.followUpDate) <= new Date();
            return (
              <tr key={c.id} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                <td className="py-2.5 px-3 font-medium text-foreground">{c.name}</td>
                <td className="py-2.5 px-3 text-muted-foreground text-xs">{c.director}</td>
                <td className="py-2.5 px-3 font-mono-num text-muted-foreground">{c.letterSentDate}</td>
                <td className={`py-2.5 px-3 font-mono-num ${isOverdue ? 'text-tier-a font-semibold' : 'text-muted-foreground'}`}>
                  {c.followUpDate}
                  {isOverdue && <span className="ml-1 text-[10px]">⚠️</span>}
                </td>
                <td className="py-2.5 px-3 text-center text-xs">
                  {c.responseStatus && (
                    <span className="inline-flex items-center gap-1">
                      {responseIcons[c.responseStatus]} {c.responseStatus}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ResponseCards({ companies }: { companies: Company[] }) {
  const sorted = [...companies].filter(c => c.responseStatus).sort((a, b) => {
    return responseOrder.indexOf(a.responseStatus!) - responseOrder.indexOf(b.responseStatus!);
  });

  return (
    <div className="space-y-3">
      {sorted.map(c => (
        <div
          key={c.id}
          className={`bg-card border border-border rounded-lg p-4 border-l-[3px] ${
            responseBorderColors[c.responseStatus || 'AWAITING']
          } hover:shadow-[0_0_20px_-8px_hsl(var(--primary)/0.15)] transition-all duration-200`}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-foreground">{c.name}</span>
                <span className="text-xs text-muted-foreground">· {c.sector}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {c.director} ({c.age}) · {c.location}
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-mono-num">
                Sent: {c.letterSentDate} &nbsp; Follow-up: {c.followUpDate}
              </p>
            </div>
            <span className="text-sm px-2 py-0.5 rounded bg-muted">
              {c.responseStatus && `${responseIcons[c.responseStatus]} ${c.responseStatus}`}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
            <select
              defaultValue={c.responseStatus}
              className="px-2 py-1.5 rounded-md bg-background border border-border text-xs text-foreground focus:outline-none focus:border-primary/40 transition-colors"
            >
              {responseOrder.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-all duration-150 active:scale-[0.98]">
              Update
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
