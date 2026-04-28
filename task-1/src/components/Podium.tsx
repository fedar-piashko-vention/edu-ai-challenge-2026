import type { Employee } from '../types';
import { avatarUrl } from '../lib/avatar';

interface PodiumProps {
  leaders: Employee[];
}

function PodiumCard({
  emp,
  rank,
  variant,
}: {
  emp: Employee;
  rank: 1 | 2 | 3;
  variant: 'gold' | 'silver' | 'bronze';
}) {
  const ringClass =
    variant === 'gold'
      ? 'lb-podium-card--gold'
      : variant === 'silver'
        ? 'lb-podium-card--silver'
        : 'lb-podium-card--bronze';
  const scoreClass =
    variant === 'gold' ? 'lb-score-pill--gold' : 'lb-score-pill--blue';

  return (
    <div className={`lb-podium-card ${ringClass}`}>
      <div className="lb-podium-avatar-wrap">
        <img
          className="lb-avatar lb-avatar--podium"
          src={avatarUrl(emp.avatarSeed)}
          alt=""
          width={120}
          height={120}
        />
        <span className={`lb-rank-dot lb-rank-dot--${variant}`}>{rank}</span>
      </div>
      <div className="lb-podium-name">{emp.displayName}</div>
      <div className="lb-podium-title">{emp.titleLine}</div>
      <div className={`lb-score-pill ${scoreClass}`}>
        <span className="lb-score-star" aria-hidden>
          ★
        </span>
        <span>{emp.total}</span>
      </div>
      <div
        className={`lb-podium-block lb-podium-block--${variant}`}
        aria-hidden
      >
        <span className="lb-podium-block-num">{rank}</span>
      </div>
    </div>
  );
}

export function Podium({ leaders }: PodiumProps) {
  const first = leaders[0];
  const second = leaders[1];
  const third = leaders[2];

  if (!first) {
    return (
      <div className="lb-podium-empty text-muted py-4 text-center">
        No results for the current filters.
      </div>
    );
  }

  return (
    <>
      {/* Horizontal: 2 – 1 – 3 */}
      <div className="lb-podium lb-podium--horizontal d-none d-md-flex align-items-end justify-content-center">
        <div className="lb-podium-slot lb-podium-slot--side">
          {second ? (
            <PodiumCard emp={second} rank={2} variant="silver" />
          ) : (
            <div className="lb-podium-placeholder" />
          )}
        </div>
        <div className="lb-podium-slot lb-podium-slot--center">
          <PodiumCard emp={first} rank={1} variant="gold" />
        </div>
        <div className="lb-podium-slot lb-podium-slot--side">
          {third ? (
            <PodiumCard emp={third} rank={3} variant="bronze" />
          ) : (
            <div className="lb-podium-placeholder" />
          )}
        </div>
      </div>

      {/* Vertical: 1, 2, 3 */}
      <div className="lb-podium lb-podium--vertical d-flex d-md-none flex-column align-items-center">
        <PodiumCard emp={first} rank={1} variant="gold" />
        {second ? (
          <PodiumCard emp={second} rank={2} variant="silver" />
        ) : null}
        {third ? (
          <PodiumCard emp={third} rank={3} variant="bronze" />
        ) : null}
      </div>
    </>
  );
}
