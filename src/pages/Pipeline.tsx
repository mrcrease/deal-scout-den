import { useState, useMemo } from 'react';
import { ExternalLink, AlertTriangle, X, Check, Ban, Undo2, Search } from 'lucide-react';
import { companies, Company, Tier, CompanyStatus, formatRevenue, timeAgo, ResponseStatus } from '@/data/mock';
import { TierBadge } from '@/components/TierBadge';
import { StatusPill } from '@/components/StatusPill';
import { ScoreBar } from '@/components/ScoreBar';

export default function Pipeline() {
  const [selectedTiers, setSelectedTiers] = useState<Set<Tier>>(new Set(['A', 'B']));
  const [selectedStatuses, setSelectedStatuses] = useState<Set<CompanyStatus>>(new Set(['SCORED']));
  const [minScore, setMinScore] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'date'>('score');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const toggleSet = <T,>(set: Set<T>, val: T) => {
    const next = new Set(set);
    if (next.has(val)) next.delete(val); else next.add(val);
    return next;
  };

  const filtered = useMemo(() => {
    let list = companies.filter(c => {
      if (selectedTiers.size > 0 && !selectedTiers.has(c.tier)) return false;
      if (selectedStatuses.size > 0 && !selectedStatuses.has(c.status)) return false;
      if (c.score < minScore) return false;
      if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase()) && !c.sector.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (regionFilter && !c.location.toLowerCase().includes(regionFilter.toLowerCase())) return false;
      return true;
    });
    list.sort((a, b) => sortBy === 'score' ? b.score - a.score : new Date(b.foundDate).getTime() - new Date(a.foundDate).getTime());
    return list;
  }, [selectedTiers, selectedStatuses, minScore, searchQuery, regionFilter, sortBy]);

  const tierAScored = filtered.filter(c => c.tier === 'A' && c.status === 'SCORED');
  const tierAScoredUnrestricted = tierAScored.filter(c => !c.restricted);
  const tierAScoredRestricted = tierAScored.length - tierAScoredUnrestricted.length;

  const tiers: Tier[] = ['A', 'B', 'C', 'D'];
  const statuses: CompanyStatus[] = ['SCORED', 'APPROVED', 'ENRICHED', 'NEW', 'LETTER_SENT'];

  return (
    <div className="flex h-screen overflow-hidden animate-fade-in">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-xl font-semibold text-foreground">Pipeline Browser</h2>
          <p className="text-sm text-muted-foreground">Browse, filter, and approve acquisition targets.</p>
        </div>

        {/* Filter bar */}
        <div className="px-6 pb-3 flex flex-wrap items-center gap-3 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-md text-xs bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 w-40 transition-colors"
            />
          </div>

          <div className="w-px h-5 bg-border" />

          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-1">Tier:</span>
            {tiers.map(t => (
              <button
                key={t}
                onClick={() => setSelectedTiers(toggleSet(selectedTiers, t))}
                className={`px-2.5 py-1 rounded text-xs font-medium border transition-all duration-150 ${
                  selectedTiers.has(t) ? 'bg-primary/15 text-primary border-primary/30 shadow-[0_0_8px_-2px_hsl(var(--primary)/0.3)]' : 'bg-card text-muted-foreground border-border hover:border-primary/20'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-1">Status:</span>
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setSelectedStatuses(toggleSet(selectedStatuses, s))}
                className={`px-2.5 py-1 rounded text-xs font-medium border transition-all duration-150 ${
                  selectedStatuses.has(s) ? 'bg-primary/15 text-primary border-primary/30' : 'bg-card text-muted-foreground border-border hover:border-primary/20'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Min Score:</span>
            <input
              type="range" min={0} max={100} value={minScore}
              onChange={e => setMinScore(Number(e.target.value))}
              className="w-24 accent-primary"
            />
            <span className="text-xs font-mono-num text-foreground w-6">{minScore}</span>
          </div>
          <input
            placeholder="Region..."
            value={regionFilter}
            onChange={e => setRegionFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded text-xs bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 w-28 transition-colors"
          />
          <div className="flex items-center border border-border rounded-md overflow-hidden">
            <button
              onClick={() => setSortBy('score')}
              className={`px-3 py-1.5 text-xs transition-all duration-150 ${sortBy === 'score' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:text-foreground'}`}
            >
              Score ↓
            </button>
            <button
              onClick={() => setSortBy('date')}
              className={`px-3 py-1.5 text-xs transition-all duration-150 ${sortBy === 'date' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:text-foreground'}`}
            >
              Recently Found
            </button>
          </div>
          <span className="ml-auto text-xs text-muted-foreground font-mono-num">{filtered.length} results</span>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-6">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-background z-[5]">
              <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                <th className="py-2.5 px-2 text-center w-8">⚑</th>
                <th className="py-2.5 px-2 text-left">Company</th>
                <th className="py-2.5 px-2 text-left">Sector</th>
                <th className="py-2.5 px-2 text-left">Director</th>
                <th className="py-2.5 px-2 text-right">Age</th>
                <th className="py-2.5 px-2 text-right">Score</th>
                <th className="py-2.5 px-2 text-center">Tier</th>
                <th className="py-2.5 px-2 text-left">Location</th>
                <th className="py-2.5 px-2 text-right">Revenue</th>
                <th className="py-2.5 px-2 text-center">Status</th>
                <th className="py-2.5 px-2 text-left">Found</th>
                <th className="py-2.5 px-2 text-center w-8">CH</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 30).map(c => (
                <tr
                  key={c.id}
                  onClick={() => setSelectedCompany(c)}
                  className={`border-b border-border/50 hover:bg-accent/50 cursor-pointer transition-all duration-100 ${
                    selectedCompany?.id === c.id ? 'active-row' : ''
                  }`}
                >
                  <td className="py-2.5 px-2 text-center">{c.restricted ? '🚫' : ''}</td>
                  <td className="py-2.5 px-2 font-medium text-foreground">{c.name}</td>
                  <td className="py-2.5 px-2 text-muted-foreground text-xs">{c.sector}</td>
                  <td className="py-2.5 px-2 text-muted-foreground text-xs">{c.director}</td>
                  <td className="py-2.5 px-2 text-right font-mono-num text-muted-foreground">{c.age}</td>
                  <td className="py-2.5 px-2 text-right">
                    <ScoreBar score={c.score} />
                  </td>
                  <td className="py-2.5 px-2 text-center"><TierBadge tier={c.tier} /></td>
                  <td className="py-2.5 px-2 text-muted-foreground text-xs">{c.location}</td>
                  <td className="py-2.5 px-2 text-right font-mono-num text-muted-foreground">{formatRevenue(c.revenue)}</td>
                  <td className="py-2.5 px-2 text-center"><StatusPill status={c.status} /></td>
                  <td className="py-2.5 px-2 text-xs text-muted-foreground">{timeAgo(c.foundDate)}</td>
                  <td className="py-2.5 px-2 text-center">
                    <a href={c.companiesHouseUrl} target="_blank" rel="noopener" onClick={e => e.stopPropagation()} className="text-muted-foreground hover:text-primary transition-colors">
                      <ExternalLink className="h-3.5 w-3.5 inline" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bulk approve bar */}
        {tierAScored.length > 0 && (
          <div className="px-6 py-3 border-t border-border bg-card flex items-center justify-between">
            <span className="text-sm text-foreground">
              ✅ Approve all <strong>{tierAScoredUnrestricted.length}</strong> Tier A companies in view
              {tierAScoredRestricted > 0 && <span className="text-muted-foreground"> ({tierAScoredRestricted} restricted excluded)</span>}
            </span>
            <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all duration-150 active:scale-[0.98]">
              Confirm Bulk Approve
            </button>
          </div>
        )}
      </div>

      {/* Detail drawer */}
      {selectedCompany && (
        <CompanyDrawer company={selectedCompany} onClose={() => setSelectedCompany(null)} />
      )}
    </div>
  );
}

function CompanyDrawer({ company: c, onClose }: { company: Company; onClose: () => void }) {
  const [notes, setNotes] = useState(c.notes || '');
  const [responseStatus, setResponseStatus] = useState<ResponseStatus>(c.responseStatus || 'AWAITING');

  const signals: string[] = [];
  if (c.age >= 55 && c.age <= 75) signals.push(`Director age ${c.age} — prime range`);
  if (c.directorCount === 1) signals.push('Solo director');
  if (c.companyYears >= 10) signals.push(`Established ${c.companyYears} years`);
  if (['Commercial Cleaning', 'Window Cleaning', 'Specialist Cleaning', 'Pest Control', 'Grounds Maintenance', 'Facilities Support'].includes(c.sector)) signals.push('Priority sector');

  const firstName = c.director.split(', ')[1] || 'Director';

  return (
    <div className="w-[600px] shrink-0 border-l border-border bg-card h-screen overflow-y-auto animate-slide-in-right">
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-foreground">{c.name}</h2>
            <TierBadge tier={c.tier} />
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-accent">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Score hero */}
        <div className="flex items-center gap-4 p-3 rounded-lg bg-background border border-border">
          <div className={`text-3xl font-bold font-mono-num ${c.score >= 50 ? 'text-tier-a' : c.score >= 30 ? 'text-tier-b' : 'text-tier-c'}`}>
            {c.score}
          </div>
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1">Acquisition Score</div>
            <div className="h-2 rounded-full bg-border overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${c.score >= 50 ? 'bg-tier-a' : c.score >= 30 ? 'bg-tier-b' : 'bg-tier-c'}`}
                style={{ width: `${c.score}%` }}
              />
            </div>
          </div>
          <TierBadge tier={c.tier} />
        </div>

        {/* Restricted alert */}
        {c.restricted && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            🚫 Restricted sector — refer to a suitable buyer
          </div>
        )}

        {/* Info grid */}
        <div className="grid grid-cols-3 gap-x-6 gap-y-3 text-sm">
          <InfoItem label="Director" value={c.director} />
          <InfoItem label="Revenue" value={`£${c.revenue.toLocaleString()}`} />
          <InfoItem label="Status" value={c.status.replace('_', ' ')} />
          <InfoItem label="Age" value={`${c.age} yrs`} />
          <InfoItem label="Source" value="accounts" />
          <InfoItem label="Sector" value={c.sector} />
          <InfoItem label="On file" value={`${c.directorCount} director${c.directorCount > 1 ? 's' : ''}`} />
          <InfoItem label="Location" value={`${c.location}, ${c.postcode}`} />
          <InfoItem label="SIC" value={c.sic} />
          <InfoItem label="Incorporated" value={`${c.incorporated} (${c.companyYears}y)`} />
        </div>

        {/* Signals */}
        {signals.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {signals.map(s => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-md bg-emerald/10 text-emerald border border-emerald/20 flex items-center gap-1">
                <span className="text-emerald">✓</span> {s}
              </span>
            ))}
          </div>
        )}

        {/* Letter preview */}
        <details className="group">
          <summary className="text-sm font-medium text-foreground cursor-pointer hover:text-primary transition-colors flex items-center gap-2">
            <span className="text-xs bg-muted px-2 py-0.5 rounded">📄</span>
            Preview Letter
          </summary>
          <pre className="mt-2 p-3 bg-background rounded-md border border-border text-xs text-muted-foreground font-mono max-h-[300px] overflow-y-auto whitespace-pre-wrap">
{`Dear ${firstName},

My name is Leandro Crease, and I run STRVRS — a company focused
on acquiring established ${c.sector.toLowerCase()} businesses like
${c.name} from founders who are considering their next chapter.

I understand that after ${c.companyYears} years of building something
meaningful, the thought of stepping back can bring mixed feelings.
I want you to know that our approach is designed to honour what
you've built while ensuring continuity for your team and clients.

I'd welcome the chance to have a brief, confidential conversation
at your convenience.

Best regards,
Leandro Crease
STRVRS`}
          </pre>
        </details>

        {/* Notes */}
        <div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Record callback notes…"
            className="w-full px-3 py-2 rounded-md bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 resize-none h-20 transition-colors"
          />
          <button className="mt-2 px-3 py-1.5 rounded-md bg-card border border-border text-xs text-foreground hover:bg-accent transition-all duration-150 active:scale-[0.98]">
            💾 Save Note
          </button>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2 border-t border-border">
          {c.status === 'SCORED' && (
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all duration-150 active:scale-[0.98]">
                <Check className="h-4 w-4" /> Approve for Letter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-md border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-150">
                <Ban className="h-4 w-4" /> Skip Company
              </button>
            </div>
          )}
          {c.status === 'APPROVED' && (
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-md border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-150">
                <Undo2 className="h-4 w-4" /> Undo Approval
              </button>
              <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">Awaiting letter send</span>
            </div>
          )}
          {c.status === 'LETTER_SENT' && (
            <span className="text-xs px-3 py-1 rounded-full bg-emerald/10 text-emerald">📬 Letter sent on {c.letterSentDate}</span>
          )}

          {(c.status === 'APPROVED' || c.status === 'LETTER_SENT') && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Mark Response:</span>
              <select
                value={responseStatus}
                onChange={e => setResponseStatus(e.target.value as ResponseStatus)}
                className="px-2 py-1.5 rounded-md bg-background border border-border text-xs text-foreground focus:outline-none focus:border-primary/40 transition-colors"
              >
                {(['AWAITING', 'INTERESTED', 'CALLBACK', 'COLD', 'NOT_INTERESTED'] as ResponseStatus[]).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-all duration-150 active:scale-[0.98]">
                Update
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
      <p className="text-sm text-foreground font-mono-num">{value}</p>
    </div>
  );
}
