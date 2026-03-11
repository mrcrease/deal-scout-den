export type CompanyStatus = 'NEW' | 'ENRICHED' | 'SCORED' | 'APPROVED' | 'LETTER_SENT' | 'EXCLUDED';
export type Tier = 'A' | 'B' | 'C' | 'D';
export type ResponseStatus = 'AWAITING' | 'INTERESTED' | 'CALLBACK' | 'COLD' | 'NOT_INTERESTED' | '2ND_LETTER_DUE';

export interface Company {
  id: string;
  name: string;
  sector: string;
  sic: string;
  director: string;
  age: number;
  score: number;
  tier: Tier;
  location: string;
  postcode: string;
  revenue: number;
  status: CompanyStatus;
  foundDate: string;
  incorporated: string;
  companyYears: number;
  directorCount: number;
  restricted: boolean;
  letterSentDate?: string;
  followUpDate?: string;
  responseStatus?: ResponseStatus;
  notes?: string;
  companiesHouseUrl?: string;
}

const sectors = [
  'Commercial Cleaning', 'Window Cleaning', 'Specialist Cleaning', 'Pest Control',
  'Grounds Maintenance', 'Waste Collection', 'Materials Recovery', 'Electrical Installation',
  'Plumbing & HVAC', 'Facilities Support', 'Freight Transport', 'Metal Products Repair',
  'Machinery Repair', 'Electrical Equipment Repair',
];

const cities = [
  'Birmingham', 'Manchester', 'Leeds', 'Bristol', 'Sheffield',
  'Liverpool', 'Newcastle', 'Nottingham', 'Leicester', 'Coventry',
  'Southampton', 'Reading', 'Wolverhampton', 'Derby', 'Stoke-on-Trent',
];

const firstNames = ['Michael', 'David', 'John', 'Robert', 'James', 'William', 'Richard', 'Peter', 'Andrew', 'Stephen', 'Paul', 'Mark', 'Ian', 'Gary', 'Alan', 'Brian', 'Keith', 'Colin', 'Derek', 'Graham'];
const lastNames = ['Jones', 'Smith', 'Williams', 'Brown', 'Taylor', 'Davies', 'Wilson', 'Evans', 'Thomas', 'Johnson', 'Roberts', 'Walker', 'Wright', 'Robinson', 'Thompson', 'White', 'Hughes', 'Edwards', 'Green', 'Hall'];

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function getTier(score: number): Tier {
  if (score >= 50) return 'A';
  if (score >= 30) return 'B';
  if (score >= 15) return 'C';
  return 'D';
}

function generateCompany(i: number): Company {
  const score = rand(5, 95);
  const tier = getTier(score);
  const status: CompanyStatus = i < 5 ? 'LETTER_SENT' : i < 15 ? 'APPROVED' : i < 37 ? 'SCORED' : i < 60 ? 'ENRICHED' : 'NEW';
  const sector = sectors[rand(0, sectors.length - 1)];
  const city = cities[rand(0, cities.length - 1)];
  const firstName = firstNames[rand(0, firstNames.length - 1)];
  const lastName = lastNames[rand(0, lastNames.length - 1)];
  const age = rand(45, 72);
  const revenue = rand(200, 5000) * 1000;
  const companyYears = rand(5, 30);
  const restricted = sector === 'Freight Transport' && Math.random() > 0.7;
  const daysAgo = rand(0, 14);

  const base: Company = {
    id: `comp-${i.toString().padStart(4, '0')}`,
    name: `${lastName} ${sector.split(' ')[0]} Ltd`,
    sector,
    sic: `${rand(10000, 99999)}`,
    director: `${lastName.toUpperCase()}, ${firstName}`,
    age,
    score,
    tier,
    location: city,
    postcode: `${city.substring(0, 1).toUpperCase()}${rand(1, 20)} ${rand(1, 9)}${String.fromCharCode(65 + rand(0, 25))}${String.fromCharCode(65 + rand(0, 25))}`,
    revenue,
    status,
    foundDate: new Date(Date.now() - daysAgo * 86400000).toISOString(),
    incorporated: `${2024 - companyYears}-${String(rand(1, 12)).padStart(2, '0')}`,
    companyYears,
    directorCount: rand(1, 3),
    restricted,
    companiesHouseUrl: `https://find-and-update.company-information.service.gov.uk/company/${rand(10000000, 99999999)}`,
  };

  if (status === 'LETTER_SENT') {
    base.letterSentDate = new Date(Date.now() - rand(3, 14) * 86400000).toISOString().split('T')[0];
    base.followUpDate = new Date(Date.now() + rand(1, 14) * 86400000).toISOString().split('T')[0];
    base.responseStatus = (['AWAITING', 'INTERESTED', 'CALLBACK', 'COLD', 'AWAITING'] as ResponseStatus[])[rand(0, 4)];
  }

  return base;
}

export const companies: Company[] = Array.from({ length: 120 }, (_, i) => generateCompany(i));

export const pipelineCounts = {
  EXCLUDED: 60666,
  NEW: 36571,
  ENRICHED: 7144,
  SCORED: 143,
  APPROVED: 10,
  LETTER_SENT: 5,
};

export const scoreDistribution = {
  'A HOT': companies.filter(c => c.tier === 'A').length,
  'B WARM': companies.filter(c => c.tier === 'B').length,
  'C COOL': companies.filter(c => c.tier === 'C').length,
  'D Skip': companies.filter(c => c.tier === 'D').length,
};

export const sectorBreakdown = sectors.map(s => ({
  sector: s,
  count: companies.filter(c => c.sector === s).length,
})).sort((a, b) => b.count - a.count);

export const recentActivity = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(Date.now() - (6 - i) * 86400000);
  return { date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }), count: rand(20, 180) };
});

export function formatRevenue(n: number): string {
  if (n >= 1000000) return `£${(n / 1000000).toFixed(1)}m`;
  if (n >= 1000) return `£${(n / 1000).toFixed(0)}k`;
  return `£${n}`;
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return '1d ago';
  return `${days}d ago`;
}
