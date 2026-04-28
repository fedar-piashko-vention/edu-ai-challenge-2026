export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export type StatKind = 'education' | 'project' | 'community';

export interface ActivityRow {
  activity: string;
  timeSpent: string;
  date: string;
  xpPoints: number;
}

export interface Employee {
  id: string;
  displayName: string;
  titleLine: string;
  avatarSeed: string;
  year: number;
  quarter: Quarter;
  category: string;
  team: string;
  country: string;
  region: string;
  stats: Record<StatKind, number>;
  total: number;
  activities: ActivityRow[];
}

export interface LeaderboardFilters {
  year: string;
  quarter: string;
  category: string;
  team: string;
  country: string;
  region: string;
  search: string;
}
