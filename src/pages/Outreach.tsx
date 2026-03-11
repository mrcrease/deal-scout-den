import { useState } from 'react';
import { companies, Company, formatRevenue, ResponseStatus } from '@/data/mock';
import { MetricCard } from '@/components/MetricCard';
import { StatusPill } from '@/components/StatusPill';
import { TierBadge } from '@/components/TierBadge';

const responseIcons: Record<string, string> = {
  INTERESTED: '🟢',
  CALLBACK: '📞',
  '2ND_LETTER_DUE': '📬',
  AWAITING: '⏳',
  COLD: '❄️',
  NOT_INTERESTED: '🚫',
};

const responseOrder: ResponseStatus[] = ['INTERESTED', 'CALLBACK', '2ND_LETTER_DUE', 'AWAITING', 'COLD', 'NOT_INTERESTED'];

export default function Outreach() {
  const [activeTab, setActiveTab] = useState<'approved' | 'sent' | 'responses'>('approved');
  const approved = companies.filter(c => c.status === 'APPROVED');
  const sent = companies.filter(c => c.status === 'LETTER_SENT');
  const interested = sent.filter(c => c.responseStatus === 'INTERESTED').length;

  const tabs = [
    { id: 'approved' as const, label: `Approved (${approved.length})` },
    { id: 'sent' as const, label: `Sent (${sent.length})` },
    { id: 'responses' as const, label: 'Responses' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Outreach Tracker</h2>
      </div>

      <div className="grid grid-cols-5 gap-3">
        <MetricCard label="Approved Pending" value={approved.length} />
        <MetricCard label="Letters Sent" value={sent.length} />
        <MetricCard label="Follow-ups Due" value={sent.filter(c => c.followUpDate && new Date(c.followUpDate) <= new Date()).length} />
        <MetricCard label="Interested" value={interested} />
        <MetricCard label="2nd Letter Due" value={0} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 text-sm transition-colors border-b-2 -mb-px ${
              activeTab === t.id ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
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
          <tr className="border-b border-border text-xs text-muted-foreground">
            <th className="py-2 px-3 text-left">Company</th>
            <th className="py-2 px-3 text-left">Sector</th>
            <th className="py-2 px-3 text-left">Director</th>
            <th className="py-2 px-3 text-center">Tier</th>
            <th className="py-2 px-3 text-left">Location</th>
            <th className="py-2 px-3 text-right">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {companies.map(c => (
            <tr key={c.id} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
              <td className="py-2 px-3 font-medium text-foreground">{c.name}</td>
              <td className="py-2 px-3 text-muted-foreground">{c.sector}</td>
              <td className="py-2 px-3 text-muted-foreground">{c.director}</td>
              <td className="py-2 px-3 text-center"><TierBadge tier={c.tier} /></td>
              <td className="py-2 px-3 text-muted-foreground">{c.location}</td>
              <td className="py-2 px-3 text-right font-mono-num text-muted-foreground">{formatRevenue(c.revenue)}</td>
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
          <tr className="border-b border-border text-xs text-muted-foreground">
            <th className="py-2 px-3 text-left">Company</th>
            <th className="py-2 px-3 text-left">Director</th>
            <th className="py-2 px-3 text-left">Sent Date</th>
            <th className="py-2 px-3 text-left">Follow-up</th>
            <th className="py-2 px-3 text-center">Response</th>
          </tr>
        </thead>
        <tbody>
          {companies.map(c => (
            <tr key={c.id} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
              <td className="py-2 px-3 font-medium text-foreground">{c.name}</td>
              <td className="py-2 px-3 text-muted-foreground">{c.director}</td>
              <td className="py-2 px-3 font-mono-num text-muted-foreground">{c.letterSentDate}</td>
              <td className="py-2 px-3 font-mono-num text-muted-foreground">{c.followUpDate}</td>
              <td className="py-2 px-3 text-center text-xs">
                {c.responseStatus && (
                  <span>{responseIcons[c.responseStatus]} {c.responseStatus}</span>
                )}
              </td>
            </tr>
          ))}
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
        <div key={c.id} className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-foreground">{c.name}</span>
                <span className="text-xs text-muted-foreground">· {c.sector}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {c.director} ({c.age}) · {c.location}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Sent: {c.letterSentDate} &nbsp; Follow-up: {c.followUpDate}
              </p>
            </div>
            <span className="text-sm">
              {c.responseStatus && `${responseIcons[c.responseStatus]} ${c.responseStatus}`}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <select className="px-2 py-1.5 rounded-md bg-background border border-border text-xs text-foreground focus:outline-none focus:border-primary/40">
              {responseOrder.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
              Update
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
