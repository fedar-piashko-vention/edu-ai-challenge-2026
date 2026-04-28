import { useId } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faGraduationCap,
  faDisplay,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import type { Employee, StatKind } from '../types';
import { avatarUrl } from '../lib/avatar';
import { formatLeaderDate } from '../lib/formatLeaderDate';

const statIcon: Record<StatKind, typeof faGraduationCap> = {
  education: faGraduationCap,
  project: faDisplay,
  community: faUsers,
};

const statLabel: Record<StatKind, string> = {
  education: 'Learning activities',
  project: 'Delivery',
  community: 'Community',
};

/** Same order as reference lists (monitor before cap when both appear). */
const STAT_ORDER: StatKind[] = ['project', 'education', 'community'];

interface LeaderRowProps {
  employee: Employee;
  rank: number;
  expanded: boolean;
  onToggle: () => void;
}

export function LeaderRow({ employee, rank, expanded, onToggle }: LeaderRowProps) {
  const collapseId = useId();
  const rowId = `row-${employee.id}`;

  const statsToShow = STAT_ORDER.filter((k) => employee.stats[k] > 0);

  return (
    <div
      className={`lb-leader-card ${expanded ? 'lb-leader-card--open' : ''}`}
    >
      <div
        className="lb-row-summary"
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
        <div className="lb-row-rank" aria-hidden>
          {rank}
        </div>

        <img
          className="lb-avatar lb-avatar--row rounded-circle"
          src={avatarUrl(employee.avatarSeed)}
          alt=""
          width={48}
          height={48}
        />

        <div className="lb-row-identity">
          <div className="lb-row-name">{employee.displayName}</div>
          <div className="lb-row-meta">{employee.titleLine}</div>
        </div>

        <div className="lb-row-stats">
          {statsToShow.map((k) => (
            <div key={k} className="lb-stat-cell">
              <FontAwesomeIcon
                icon={statIcon[k]}
                className="lb-stat-icon-top"
                title={statLabel[k]}
              />
              <span className="lb-stat-num">{employee.stats[k]}</span>
            </div>
          ))}
        </div>

        <div className="lb-row-stat-divider d-none d-sm-block" aria-hidden />

        <div className="lb-row-total">
          <span className="lb-total-label">Total</span>
          <div className="lb-total-main">
            <span className="lb-total-star" aria-hidden>
              ★
            </span>
            <span className="lb-total-value">{employee.total}</span>
          </div>
        </div>

        <button
          type="button"
          className={`lb-expand-btn btn rounded-circle border-0 ${expanded ? 'lb-expand-btn--open' : ''}`}
          aria-expanded={expanded}
          aria-controls={collapseId}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          <FontAwesomeIcon icon={faChevronDown} />
        </button>
      </div>

      <Collapse in={expanded}>
        <div id={collapseId}>
          <div className="lb-expanded-divider" />
          <div className="lb-row-expanded">
            <div className="lb-recent-activity-heading">Recent activity</div>
            <div className="table-responsive">
              <table className="table lb-activity-table mb-0">
                <thead>
                  <tr>
                    <th scope="col">Activity</th>
                    <th scope="col">Category</th>
                    <th scope="col">Date</th>
                    <th scope="col" className="text-end">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employee.activities.map((row, i) => (
                    <tr key={`${employee.id}-act-${i}`}>
                      <td className="lb-activity-title">{row.activity}</td>
                      <td>
                        <span
                          className={`lb-cat-badge lb-cat-badge--muted`}
                        >
                          {row.category}
                        </span>
                      </td>
                      <td className="lb-activity-date">
                        {formatLeaderDate(row.date)}
                      </td>
                      <td className="text-end lb-activity-points">
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
