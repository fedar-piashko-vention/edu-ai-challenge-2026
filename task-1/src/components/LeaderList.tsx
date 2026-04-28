import type { Employee } from '../types';
import { LeaderRow } from './LeaderRow';

interface LeaderListProps {
  leaders: Employee[];
  expandedId: string | null;
  onExpandedChange: (id: string | null) => void;
}

export function LeaderList({
  leaders,
  expandedId,
  onExpandedChange,
}: LeaderListProps) {
  return (
    <div className="lb-leader-list">
      {leaders.map((emp, index) => (
        <LeaderRow
          key={emp.id}
          employee={emp}
          rank={index + 1}
          expanded={expandedId === emp.id}
          onToggle={() =>
            onExpandedChange(expandedId === emp.id ? null : emp.id)
          }
        />
      ))}
    </div>
  );
}
