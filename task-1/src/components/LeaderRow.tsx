import { useId } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faMinus,
  faChevronDown,
  faGraduationCap,
  faDisplay,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import type { Employee, StatKind } from '../types';
import { avatarUrl } from '../lib/avatar';

const statIcon: Record<StatKind, typeof faGraduationCap> = {
  education: faGraduationCap,
  project: faDisplay,
  community: faUsers,
};

const statLabel: Record<StatKind, string> = {
  education: 'Learning',
  project: 'Delivery',
  community: 'Community',
};

interface LeaderRowProps {
  employee: Employee;
  rank: number;
  expanded: boolean;
  onToggle: () => void;
}

export function LeaderRow({ employee, rank, expanded, onToggle }: LeaderRowProps) {
  const collapseId = useId();
  const rowId = `row-${employee.id}`;

  return (
    <div
      className={`lb-leader-card card border ${expanded ? 'lb-leader-card--open' : ''}`}
    >
      <div
        className="card-body p-3"
        role="button"
        tabIndex={0}
        id={rowId}
        aria-expanded={expanded}
        aria-controls={collapseId}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <div className="d-flex flex-wrap align-items-center gap-2 gap-md-3">
          <div className="lb-rank-num d-none d-sm-block">{rank}</div>
          <div className="d-flex d-sm-none flex-column me-1">
            <span className="text-muted small">#</span>
            <span className="lb-rank-num lb-rank-num--sm">{rank}</span>
          </div>
          <img
            className="lb-avatar lb-avatar--row rounded-circle"
            src={avatarUrl(employee.avatarSeed)}
            alt=""
            width={48}
            height={48}
          />
          <div className="flex-grow-1 min-w-0">
            <div className="fw-semibold">{employee.displayName}</div>
            <div className="text-muted small text-truncate">{employee.titleLine}</div>
          </div>

          <div className="lb-stat-strip d-none d-md-flex align-items-center gap-3 ms-auto">
            {(Object.keys(employee.stats) as StatKind[]).map((k) => (
              <div key={k} className="lb-stat-item text-center">
                <FontAwesomeIcon
                  icon={statIcon[k]}
                  className="lb-stat-icon text-secondary mb-1"
                  title={statLabel[k]}
                />
                <div className="small fw-medium">{employee.stats[k]}</div>
              </div>
            ))}
          </div>

          <div className="lb-total-pill d-flex align-items-center gap-2 ms-md-2">
            <span className="text-primary lb-total-star" aria-hidden>
              ★
            </span>
            <div>
              <div className="text-muted text-uppercase small lh-1">Total</div>
              <div className="fw-bold text-primary fs-5 lh-1">{employee.total}</div>
            </div>
          </div>

          <button
            type="button"
            className={`lb-expand-btn btn btn-sm rounded-circle border-0 ${expanded ? 'lb-expand-btn--open' : ''}`}
            aria-expanded={expanded}
            aria-controls={collapseId}
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            <span className="d-none d-md-inline">
              <FontAwesomeIcon icon={faChevronDown} />
            </span>
            <span className="d-md-none">
              <FontAwesomeIcon icon={expanded ? faMinus : faPlus} />
            </span>
          </button>
        </div>

        <div className="lb-stat-strip-mobile d-flex d-md-none justify-content-around mt-3 pt-2 border-top">
          {(Object.keys(employee.stats) as StatKind[]).map((k) => (
            <div key={k} className="lb-stat-item text-center">
              <FontAwesomeIcon
                icon={statIcon[k]}
                className="lb-stat-icon text-secondary mb-1"
              />
              <div className="small fw-medium">{employee.stats[k]}</div>
            </div>
          ))}
        </div>
      </div>

      <Collapse in={expanded}>
        <div id={collapseId}>
          <div className="lb-detail-table-wrap px-3 pb-3">
            <div className="table-responsive">
              <table className="table table-sm lb-activity-table mb-0">
                <thead>
                  <tr className="text-muted small text-uppercase">
                    <th scope="col">Activity</th>
                    <th scope="col">Time spent</th>
                    <th scope="col">Date</th>
                    <th scope="col" className="text-end">
                      XP points
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employee.activities.map((row, i) => (
                    <tr key={`${employee.id}-act-${i}`}>
                      <td>
                        <button type="button" className="btn btn-link p-0 lb-activity-link">
                          {row.activity}
                        </button>
                      </td>
                      <td>
                        <span className="badge rounded-pill lb-time-pill">
                          {row.timeSpent}
                        </span>
                      </td>
                      <td className="text-muted">{row.date}</td>
                      <td className="text-end fw-semibold text-primary">
                        +{row.xpPoints}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  );
}
