import type { Employee, LeaderboardFilters } from '../types';

function norm(s: string): string {
  return s.trim().toLowerCase();
}

export function filterAndSortLeaders(
  employees: Employee[],
  filters: LeaderboardFilters,
): Employee[] {
  let list = employees.filter((e) => {
    if (filters.year !== 'all' && String(e.year) !== filters.year) return false;
    if (filters.quarter !== 'all' && e.quarter !== filters.quarter) return false;
    if (filters.category !== 'all' && e.category !== filters.category)
      return false;
    if (filters.team !== 'all' && e.team !== filters.team) return false;
    if (filters.country !== 'all' && e.country !== filters.country) return false;
    if (filters.region !== 'all' && e.region !== filters.region) return false;
    return true;
  });

  const q = norm(filters.search);
  if (q) {
    list = list.filter(
      (e) =>
        norm(e.displayName).includes(q) || norm(e.titleLine).includes(q),
    );
  }

  return [...list].sort((a, b) => b.total - a.total);
}

export function extractFilterOptions(employees: Employee[]) {
  const years = [...new Set(employees.map((e) => e.year))].sort((a, b) => a - b);
  const quarters = [...new Set(employees.map((e) => e.quarter))].sort();
  const categories = [...new Set(employees.map((e) => e.category))].sort();
  const teams = [...new Set(employees.map((e) => e.team))].sort();
  const countries = [...new Set(employees.map((e) => e.country))].sort();
  const regions = [...new Set(employees.map((e) => e.region))].sort();
  return {
    years,
    quarters,
    categories,
    teams,
    countries,
    regions,
  };
}
