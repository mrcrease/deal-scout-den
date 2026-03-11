import { useNavigate } from 'react-router-dom';
import { AlertTriangle, TrendingUp, Users, Clock, Mail, Star, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { MetricCard } from '@/components/MetricCard';
import { TierBadge } from '@/components/TierBadge';
import { StatusPill } from '@/components/StatusPill';
import { companies, pipelineCounts, scoreDistribution, sectorBreakdown, recentActivity, formatRevenue } from '@/data/mock';

const funnelData = Object.entries(pipelineCounts).map(([name, value]) => ({ name, value }));
const scoreData = Object.entries(scoreDistribution).map(([name, value]) => ({ name, value }));

function getScoreColor(score: number) {
  if (score >= 50) return 'text-tier-a';
  if (score >= 30) return 'text-tier-b';
  return 'text-tier-c';
}

export default function Overview() {
  const navigate = useNavigate();
  const totalInDb = Object.values(pipelineCounts).reduce((a, b) => a + b, 0);
  const priorityAB = companies.filter(c => c.tier === 'A' || c.tier === 'B').length;
  const awaitingApproval = companies.filter(c => c.status === 'SCORED').length;
  const lettersSent = companies.filter(c => c.status === 'LETTER_SENT').length;
  const interested = companies.filter(c => c.responseStatus === 'INTERESTED').length;
  const top10 = [...companies].sort((a, b) => b.score - a.score).slice(0, 10);

  return (
    <div className="p-6 space-y-6 max-w-[1400px] animate-fade-in">
      {/* Metrics */}
      <div className="grid grid-cols-6 gap-3">
        <MetricCard label="Total in DB" value={totalInDb.toLocaleString()} icon={<Users className="h-3.5 w-3.5" />} />
        <MetricCard label="Priority A/B" value={priorityAB} accent="tier-a" icon={<Star className="h-3.5 w-3.5" />} />
        <MetricCard label="Awaiting Approval" value={awaitingApproval} onClick={() => navigate('/pipeline')} accent="tier-b" icon={<Clock className="h-3.5 w-3.5" />} />
        <MetricCard label="Letters Sent" value={lettersSent} icon={<Mail className="h-3.5 w-3.5" />} />
        <MetricCard label="Interested" value={interested} accent="emerald" icon={<TrendingUp className="h-3.5 w-3.5" />} />
        <MetricCard label="Added This Run" value="143" delta="+143" accent="violet" icon={<Plus className="h-3.5 w-3.5" />} />
      </div>

      {/* Approval banner */}
      {awaitingApproval > 0 && (
        <div
          onClick={() => navigate('/pipeline')}
          className="flex items-center gap-3 px-4 py-3 rounded-lg border border-tier-b/30 bg-tier-b/10 cursor-pointer hover:bg-tier-b/15 transition-all duration-200 hover:shadow-[0_0_20px_-6px_hsl(var(--tier-b)/0.3)]"
        >
          <AlertTriangle className="h-4 w-4 text-tier-b shrink-0" />
          <span className="text-sm text-tier-b">
            ⚡ {awaitingApproval} companies waiting for approval — <span className="underline font-medium">open Pipeline to review</span>
          </span>
        </div>
      )}

      {/* Charts row */}
      <div className="grid grid-cols-5 gap-4">
        {/* Pipeline Funnel */}
        <div className="col-span-3 bg-card border border-border rounded-lg p-4 card-glow transition-all duration-200">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Pipeline Funnel</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={funnelData} layout="vertical" margin={{ left: 80, right: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 19% 16%)" />
              <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(215 14% 50%)' }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: 'hsl(215 14% 50%)' }} width={75} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(220 18% 10%)', border: '1px solid hsl(217 19% 16%)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: 'hsl(210 20% 92%)' }}
                itemStyle={{ color: 'hsl(217 91% 60%)' }}
              />
              <Bar dataKey="value" fill="hsl(217, 91%, 60%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Score Distribution */}
        <div className="col-span-2 bg-card border border-border rounded-lg p-4 card-glow transition-all duration-200">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Score Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={scoreData} margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 19% 16%)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(215 14% 50%)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(215 14% 50%)' }} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(220 18% 10%)', border: '1px solid hsl(217 19% 16%)', borderRadius: 8 }}
              />
              <Bar dataKey="value" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 10 table */}
      <div className="bg-card border border-border rounded-lg p-4 card-glow transition-all duration-200">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Top 10 Priority Targets</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-[10px] text-muted-foreground uppercase tracking-wider">
                <th className="text-left py-2.5 px-3">Company</th>
                <th className="text-left py-2.5 px-3">Sector</th>
                <th className="text-left py-2.5 px-3">Director</th>
                <th className="text-right py-2.5 px-3">Age</th>
                <th className="text-right py-2.5 px-3">Score</th>
                <th className="text-center py-2.5 px-3">Tier</th>
                <th className="text-left py-2.5 px-3">Location</th>
                <th className="text-right py-2.5 px-3">Revenue</th>
                <th className="text-center py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {top10.map((c, i) => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => navigate('/pipeline')}>
                  <td className="py-2.5 px-3 font-medium text-foreground">{c.name}</td>
                  <td className="py-2.5 px-3 text-muted-foreground text-xs">{c.sector}</td>
                  <td className="py-2.5 px-3 text-muted-foreground text-xs">{c.director}</td>
                  <td className="py-2.5 px-3 text-right font-mono-num text-muted-foreground">{c.age}</td>
                  <td className={`py-2.5 px-3 text-right font-mono-num font-bold ${getScoreColor(c.score)}`}>{c.score}</td>
                  <td className="py-2.5 px-3 text-center"><TierBadge tier={c.tier} /></td>
                  <td className="py-2.5 px-3 text-muted-foreground text-xs">{c.location}</td>
                  <td className="py-2.5 px-3 text-right font-mono-num text-muted-foreground">{formatRevenue(c.revenue)}</td>
                  <td className="py-2.5 px-3 text-center"><StatusPill status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Sector Breakdown */}
        <div className="bg-card border border-border rounded-lg p-4 card-glow transition-all duration-200">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Sector Breakdown</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={sectorBreakdown} layout="vertical" margin={{ left: 120, right: 30 }}>
              <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(215 14% 50%)' }} />
              <YAxis dataKey="sector" type="category" tick={{ fontSize: 10, fill: 'hsl(215 14% 50%)' }} width={115} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(220 18% 10%)', border: '1px solid hsl(217 19% 16%)', borderRadius: 8 }}
              />
              <Bar dataKey="count" fill="hsl(239, 84%, 67%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-lg p-4 card-glow transition-all duration-200">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Recent Activity (7 days)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={recentActivity} margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 19% 16%)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(215 14% 50%)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(215 14% 50%)' }} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(220 18% 10%)', border: '1px solid hsl(217 19% 16%)', borderRadius: 8 }}
              />
              <Area type="monotone" dataKey="count" stroke="hsl(258, 90%, 66%)" fill="hsl(258, 90%, 66%, 0.15)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
