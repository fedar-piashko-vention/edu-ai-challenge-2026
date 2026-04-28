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
      <Container className="lb-page-container">
        <h1 className="lb-page-title">Company Leader Board 2025</h1>

        <div className="lb-inner-shell">
          <header className="lb-header lb-header--inner">
            <h2 className="lb-title">Leaderboard</h2>
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
        </div>
      </Container>
    </div>
  );
}
