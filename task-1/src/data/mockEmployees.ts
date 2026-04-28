import type { ActivityRow, Employee, Quarter, StatKind } from '../types';

const YEARS = [2024, 2025] as const;
const QUARTERS: Quarter[] = ['Q1', 'Q2', 'Q3', 'Q4'];
const CATEGORIES = [
  'Engineering',
  'Quality',
  'Product',
  'Design',
  'Data',
] as const;
const TEAMS = ['Atlas', 'Beacon', 'Cedar', 'Drift'] as const;
const COUNTRIES = ['Northland', 'Southland', 'Eastland', 'Westland'] as const;
const REGIONS = ['Americas', 'Europe', 'Asia Pacific', 'Middle East'] as const;

const NAMES = [
  ['Alex', 'Rivera'],
  ['Jordan', 'Lee'],
  ['Taylor', 'Nguyen'],
  ['Casey', 'Kim'],
  ['Riley', 'Patel'],
  ['Morgan', 'Silva'],
  ['Quinn', 'Bak'],
  ['Avery', 'Hassan'],
  ['Reese', 'Okafor'],
  ['Skyler', 'Novak'],
  ['Drew', 'Martens'],
  ['Jamie', 'Costa'],
  ['Parker', 'Singh'],
  ['Sage', 'Larsson'],
  ['Rowan', 'Okada'],
  ['Finley', 'Petrova'],
  ['Emerson', 'Dubois'],
  ['Hayden', 'Alvarez'],
  ['Blair', 'Ito'],
  ['Kendall', 'Varga'],
  ['Lane', 'Frost'],
  ['Harper', 'Ndiaye'],
  ['Marlowe', 'Yilmaz'],
  ['Indigo', 'Carlsen'],
  ['Winter', 'Becker'],
  ['Storm', 'Reyes'],
  ['Ocean', 'Prasad'],
  ['River', 'Molnar'],
  ['Phoenix', 'Abbott'],
  ['Echo', 'Demir'],
] as const;

const COURSE_PREFIXES = [
  'Intro to',
  'Applied',
  'Advanced',
  'Workshop:',
  'Lab:',
  'Seminar:',
];

const TOPICS = [
  'Cloud foundations',
  'Secure coding',
  'Data literacy',
  'UX research',
  'GenAI essentials',
  'Python basics',
  'System design',
  'Testing strategy',
  'Agile facilitation',
  'Analytics overview',
];

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pick<T>(arr: readonly T[], seed: string, i = 0): T {
  return arr[hashSeed(seed + i) % arr.length];
}

function buildActivities(seed: string, totalXp: number): ActivityRow[] {
  const count = Math.min(16, Math.max(6, 6 + (hashSeed(seed) % 10)));
  const weights = Array.from(
    { length: count },
    (_, i) => 5 + (hashSeed(seed + 'w' + i) % 35),
  );
  const sumW = weights.reduce((a, b) => a + b, 0);
  let allocated = 0;
  return weights.map((w, i) => {
    const isLast = i === count - 1;
    const xp = isLast
      ? totalXp - allocated
      : Math.max(1, Math.round((totalXp * w) / sumW));
    if (!isLast) allocated += xp;
    const topic = pick(TOPICS, seed, i);
    const prefix = pick([...COURSE_PREFIXES], seed, i + 3);
    return {
      activity: `${prefix} ${topic}`,
      timeSpent: `${20 + (hashSeed(seed + 't' + i) % 120)} min`,
      date: `2025-${String(1 + (hashSeed(seed + 'd' + i) % 11)).padStart(2, '0')}-${String(1 + (hashSeed(seed + 'e' + i) % 27)).padStart(2, '0')}`,
      xpPoints: xp,
    };
  });
}

function statTriplet(seed: string, total: number): Record<StatKind, number> {
  const a = 5 + (hashSeed(seed + 'a') % 40);
  const b = 5 + (hashSeed(seed + 'b') % 35);
  const c = Math.max(0, total - a - b);
  return { education: a, project: b, community: c };
}

export function buildMockEmployees(): Employee[] {
  return NAMES.map(([first, last], idx) => {
    const id = `emp-${idx + 1}`;
    const seed = `${first}-${last}-${idx}`;
    const year = pick([...YEARS], seed);
    const quarter = pick(QUARTERS, seed);
    const category = pick([...CATEGORIES], seed);
    const team = pick([...TEAMS], seed);
    const country = pick([...COUNTRIES], seed);
    const region = pick([...REGIONS], seed);
    const total = 120 + (hashSeed(seed + 'total') % 820);
    const titleLine = `${pick(['Analyst', 'Engineer', 'Lead', 'Manager', 'Contributor'], seed)} · ${category} (${team})`;
    return {
      id,
      displayName: `${first} ${last}`,
      titleLine,
      avatarSeed: encodeURIComponent(seed),
      year,
      quarter,
      category,
      team,
      country,
      region,
      stats: statTriplet(seed, total),
      total,
      activities: buildActivities(seed, total),
    };
  });
}

export const MOCK_EMPLOYEES: Employee[] = buildMockEmployees();
