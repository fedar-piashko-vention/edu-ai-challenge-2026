import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import type { LeaderboardFilters } from '../types';

interface FilterBarProps {
  filters: LeaderboardFilters;
  onChange: (next: LeaderboardFilters) => void;
  options: {
    years: number[];
    quarters: string[];
    categories: string[];
    teams: string[];
    countries: string[];
    regions: string[];
  };
}

export function FilterBar({
  filters,
  onChange,
  options,
}: FilterBarProps) {
  const patch = (partial: Partial<LeaderboardFilters>) =>
    onChange({ ...filters, ...partial });

  return (
    <>
      {/* Desktop: single row — three selects + flexible search */}
      <div className="lb-filter-bar lb-filter-bar--desktop d-none d-md-flex align-items-stretch gap-2">
        <Form.Select
          className="lb-select lb-select--fixed"
          value={filters.year}
          onChange={(e) => patch({ year: e.target.value })}
          aria-label="Year"
        >
          <option value="all">All Years</option>
          {options.years.map((y) => (
            <option key={y} value={String(y)}>
              {y}
            </option>
          ))}
        </Form.Select>
        <Form.Select
          className="lb-select lb-select--fixed"
          value={filters.quarter}
          onChange={(e) => patch({ quarter: e.target.value })}
          aria-label="Quarter"
        >
          <option value="all">All Quarters</option>
          {options.quarters.map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </Form.Select>
        <Form.Select
          className="lb-select lb-select--fixed"
          value={filters.category}
          onChange={(e) => patch({ category: e.target.value })}
          aria-label="Category"
        >
          <option value="all">All Categories</option>
          {options.categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Form.Select>
        <InputGroup className="lb-search lb-search--grow">
          <InputGroup.Text className="lb-search-prefix">
            <FontAwesomeIcon icon={faMagnifyingGlass} aria-hidden />
          </InputGroup.Text>
          <Form.Control
            type="search"
            placeholder="Search employee..."
            value={filters.search}
            onChange={(e) => patch({ search: e.target.value })}
            aria-label="Search employees"
          />
        </InputGroup>
      </div>

      {/* Mobile: team, country, region */}
      <div className="lb-filter-bar lb-filter-bar--mobile d-flex d-md-none flex-column gap-2">
        <Form.Select
          size="sm"
          className="lb-select lb-select--mobile"
          value={filters.team}
          onChange={(e) => patch({ team: e.target.value })}
          aria-label="Team"
        >
          <option value="all">Select team</option>
          {options.teams.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Form.Select>
        <Form.Select
          size="sm"
          className="lb-select lb-select--mobile"
          value={filters.country}
          onChange={(e) => patch({ country: e.target.value })}
          aria-label="Country"
        >
          <option value="all">Select country</option>
          {options.countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Form.Select>
        <Form.Select
          size="sm"
          className="lb-select lb-select--mobile"
          value={filters.region}
          onChange={(e) => patch({ region: e.target.value })}
          aria-label="Region"
        >
          <option value="all">All Regions</option>
          {options.regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Form.Select>
        <InputGroup size="sm" className="lb-search lb-search--mobile">
          <InputGroup.Text className="lb-search-prefix">
            <FontAwesomeIcon icon={faMagnifyingGlass} aria-hidden />
          </InputGroup.Text>
          <Form.Control
            type="search"
            placeholder="Search by name..."
            value={filters.search}
            onChange={(e) => patch({ search: e.target.value })}
            aria-label="Search by name"
          />
        </InputGroup>
      </div>
    </>
  );
}
