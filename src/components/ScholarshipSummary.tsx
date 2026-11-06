import { Link } from "react-router-dom";
import { scholarships, type Scholarship } from "../scholarships";
import { monthsUntil } from "../status";
import { Icon } from "./Icon";

type Timing = { label: string; rank: number; open: boolean };

/** Where a scholarship's window stands today; rank sorts open first, then soonest. */
function timing(item: Scholarship, today: Date): Timing {
  if (item.applyMonths.length === 0) {
    return { label: item.windowNote ?? "See official page", rank: 100, open: false };
  }
  const offsets = item.applyMonths.map((month) => monthsUntil(month, today));
  if (offsets.includes(0)) return { label: "Open now", rank: -1, open: true };
  const next = Math.min(...offsets.map((value) => (value < 0 ? value + 12 : value)));
  return {
    label: next === 1 ? "Opens next month" : `Opens in ${next} months`,
    rank: next,
    open: false,
  };
}

export function ScholarshipSummary({ limit = 4 }: { limit?: number }) {
  const today = new Date();
  const ranked = scholarships
    .map((item) => ({ item, timing: timing(item, today) }))
    .sort((a, b) => a.timing.rank - b.timing.rank);
  const automatic = scholarships.filter((item) => !item.needsApplication).length;

  return (
    <section className="chart-panel scholarship-summary" aria-labelledby="sch-summary-title">
      <div className="doc-summary-head">
        <h2 id="sch-summary-title" className="chart-title">
          Scholarships
        </h2>
        <p className="doc-total">
          <strong>{scholarships.length}</strong> for the Big Four, {automatic} with no application
        </p>
      </div>

      <ul className="sch-tiles">
        {ranked.slice(0, limit).map(({ item, timing: when }) => (
          <li key={item.id} data-uni={item.government ? "gov" : item.universityId ?? "gov"}>
            <span className={when.open ? "sch-when is-open" : "sch-when"}>
              <Icon name="calendar" size={14} />
              {when.label}
            </span>
            <strong className="sch-name">{item.name}</strong>
            <span className="sch-covers">{item.covers}</span>
          </li>
        ))}
      </ul>

      <Link to="/scholarships" className="panel-link">
        All scholarships
        <Icon name="arrow" size={16} />
      </Link>
    </section>
  );
}
