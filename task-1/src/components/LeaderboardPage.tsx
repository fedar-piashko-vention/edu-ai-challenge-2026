import { useMemo, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { MOCK_EMPLOYEES } from '../data/mockEmployees';
import {
  extractFilterOptions,
  filterAndSortLeaders,
} from '../logic/filterLeaders';
import type { LeaderboardFilters } from '../types';
import { FilterBar } from './FilterBar';
import { Podium } from './Podium';
import { LeaderList } from './LeaderList';

const defaultFilters: LeaderboardFilters = {
  year: 'all',
  quarter: 'all',
  category: 'all',
  team: 'all',
  country: 'all',
  region: 'all',
  search: '',
};

export function LeaderboardPage() {
  const [filters, setFilters] = useState<LeaderboardFilters>(defaultFilters);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const options = useMemo(
    () => extractFilterOptions(MOCK_EMPLOYEES),
    [],
  );

  const leaders = useMemo(
    () => filterAndSortLeaders(MOCK_EMPLOYEES, filters),
    [filters],
  );

  const podiumLeaders = useMemo(() => leaders.slice(0, 3), [leaders]);

  return (
    <div className="lb-root min-vh-100">
      <div className="lb-mobile-header d-md-none py-4 px-3 mb-3">
        <Container>
          <h1 className="h4 fw-bold mb-2 text-primary-emphasis">
            Company Leader Board 2025
          </h1>
          <p className="text-muted small mb-0">
            Leader board. All company employees are listed in the leaderboard.
          </p>
        </Container>
      </div>

      <Container className="lb-container py-4 py-md-4">
        <header className="lb-header lb-header--desktop d-none d-md-block">
          <h1 className="lb-title">Leaderboard</h1>
          <p className="lb-subtitle">
            Top performers based on contributions and activity
          </p>
        </header>

        <div className="lb-filter-shell">
          <FilterBar
            filters={filters}
            onChange={setFilters}
            options={{
              years: options.years,
              quarters: options.quarters,
              categories: options.categories,
              teams: options.teams,
              countries: options.countries,
              regions: options.regions,
            }}
          />
        </div>

        <section className="lb-podium-section" aria-label="Top three">
          <Podium leaders={podiumLeaders} />
        </section>

        <section aria-label="Full leaderboard">
          <LeaderList
            leaders={leaders}
            expandedId={expandedId}
            onExpandedChange={setExpandedId}
          />
        </section>
      </Container>
    </div>
  );
}
