import { timelineColumn, timelineMonths } from "../status";
import { useApplications, useDemo } from "../store";
import { UniversityLogo } from "./UniversityLogo";

type Kind = "opens" | "exam" | "results";

const KIND_LABEL: Record<Kind, string> = { opens: "Opens", exam: "Exam", results: "Results" };

function Glyph({ kind }: { kind: Kind }) {
  return (
    <svg className="marker-glyph" viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
      {kind === "opens" ? (
        <circle cx="6" cy="6" r="5" fill="currentColor" />
      ) : kind === "exam" ? (
        <path d="M6 .8 11.2 6 6 11.2.8 6Z" fill="currentColor" />
      ) : (
        <circle cx="6" cy="6" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      )}
    </svg>
  );
}

/** The next twelve months, one lane per university. */
export function YearTimeline() {
  const { periods } = useDemo();
  const applications = useApplications();
  const today = new Date();
  const columns = timelineMonths(today);

  return (
    <section className="chart-panel year" aria-labelledby="year-title">
      <div className="chart-copy chart-copy-wide">
        <h2 id="year-title" className="chart-title">
          Your admissions year
        </h2>
        <p className="chart-sub">
          Starts last month, in case a window is still open.
        </p>
      </div>

      <div className="year-scroll">
        <div className="year-grid" role="table" aria-label="Application dates by university">
          <div className="year-row year-head" role="row">
            <span className="year-label" role="columnheader">
              <span className="sr-only">University</span>
            </span>
            {columns.map((month, index) => (
              <span
                key={month}
                role="columnheader"
                className={index === 1 ? "year-month is-today" : "year-month"}
              >
                {month.slice(0, 3)}
                {index === 1 ? <em>Today</em> : null}
              </span>
            ))}
          </div>

          {applications.map((item) => {
            const uni = item.university;
            const marks: Record<Kind, number> = {
              opens: timelineColumn(periods[uni.id], today),
              exam: timelineColumn(uni.examDates, today),
              results: timelineColumn(uni.releaseOfResults, today),
            };
            return (
              <div key={uni.id} className="year-row" role="row" data-uni={uni.id}>
                <span className="year-label" role="rowheader">
                  <UniversityLogo id={uni.id} name={uni.shortName} />
                  <strong>{uni.shortName}</strong>
                </span>
                {columns.map((month, index) => {
                  const here = (Object.keys(marks) as Kind[]).filter((kind) => marks[kind] === index);
                  return (
                    <span
                      key={month}
                      role="cell"
                      className={index === 1 ? "year-cell is-today" : "year-cell"}
                    >
                      {here.map((kind) => (
                        <span key={kind} className={`marker marker-${kind}`}>
                          <Glyph kind={kind} />
                          {KIND_LABEL[kind]}
                        </span>
                      ))}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
