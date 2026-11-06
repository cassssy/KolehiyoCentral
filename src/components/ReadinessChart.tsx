import { useApplications } from "../store";

const SIZE = 300;
const CENTER = SIZE / 2;
const STROKE = 15;
const GAP = 7;
const OUTER = CENTER - STROKE / 2 - 4;

/** Radial bars: one ring per university, filled by requirements done. */
export function ReadinessChart() {
  const applications = useApplications();
  const done = applications.reduce((sum, item) => sum + item.count, 0);
  const total = applications.reduce((sum, item) => sum + item.total, 0);
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <section className="chart-panel readiness" aria-labelledby="readiness-title">
      <div className="chart-copy">
        <h2 id="readiness-title" className="chart-title">
          Where you stand
        </h2>
        <p className="chart-sub">
          Requirements done, by school.
        </p>
        <ul className="readiness-legend">
          {applications.map((item) => {
            const share = item.total > 0 ? Math.round((item.count / item.total) * 100) : 0;
            return (
              <li key={item.university.id} data-uni={item.university.id}>
                <span className="legend-swatch" aria-hidden="true" />
                <span className="legend-name">{item.university.shortName}</span>
                <span className="legend-count">
                  {item.count} of {item.total}
                </span>
                <span className="legend-percent">{share}%</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="radial" role="img" aria-label={`${percent}% of requirements done overall`}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
          {applications.map((item, index) => {
            const radius = OUTER - index * (STROKE + GAP);
            const circumference = 2 * Math.PI * radius;
            const fraction = item.total > 0 ? item.count / item.total : 0;
            return (
              <g key={item.university.id} data-uni={item.university.id}>
                <circle
                  className="radial-track"
                  cx={CENTER}
                  cy={CENTER}
                  r={radius}
                  strokeWidth={STROKE}
                />
                <circle
                  className="radial-bar"
                  cx={CENTER}
                  cy={CENTER}
                  r={radius}
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - fraction)}
                  transform={`rotate(-90 ${CENTER} ${CENTER})`}
                  style={
                    {
                      "--circ": circumference,
                      "--off": circumference * (1 - fraction),
                    } as React.CSSProperties
                  }
                />
              </g>
            );
          })}
        </svg>
        <div className="radial-center" aria-hidden="true">
          <strong>{percent}%</strong>
          <span>ready</span>
        </div>
      </div>
    </section>
  );
}
