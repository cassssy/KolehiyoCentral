import { useMemo, useState } from "react";
import { Icon } from "../components/Icon";
import { universities } from "../data";
import { scholarships, type Scholarship, type ScholarshipKind } from "../scholarships";
import { timelineColumn, timelineMonths } from "../status";

const WHO = [
  { id: "all", label: "All" },
  { id: "gov", label: "Government" },
  ...universities.map((university) => ({ id: university.id, label: university.shortName })),
];

const KINDS: ScholarshipKind[] = ["Merit", "Need-based", "Free tuition"];

function brandOf(item: Scholarship): string {
  return item.government ? "gov" : item.universityId ?? "gov";
}

function windowLabel(item: Scholarship): string {
  if (item.windowNote) return item.windowNote;
  const months = item.applyMonths;
  if (months.length === 0) return "";
  const first = months[0].slice(0, 3);
  const last = months[months.length - 1].slice(0, 3);
  return months.length === 1 ? first : `${first}–${last}`;
}

export function ScholarshipsPage() {
  const [query, setQuery] = useState("");
  const [who, setWho] = useState("all");
  const [kind, setKind] = useState<ScholarshipKind | null>(null);

  const results = useMemo(() => {
    const text = query.trim().toLowerCase();
    return scholarships.filter((item) => {
      if (who === "gov" && !item.government) return false;
      // A government program that applies at one school (free tuition at UP) shows under that school too.
      if (who !== "all" && who !== "gov" && item.universityId !== who && item.universityId !== null)
        return false;
      if (kind && item.kind !== kind) return false;
      if (!text) return true;
      return [item.name, item.provider, item.covers, ...item.who]
        .join(" ")
        .toLowerCase()
        .includes(text);
    });
  }, [query, who, kind]);

  const today = new Date();
  const columns = timelineMonths(today);
  const clear = () => {
    setQuery("");
    setWho("all");
    setKind(null);
  };

  return (
    <section className="scholarships-page">
      <header className="page-head">
        <h1>Scholarships</h1>
        <p>
          Government and school aid for the Big Four. Dates change every year, so confirm on the
          official page before applying.
        </p>
      </header>

      <div className="filters" role="search">
        <label className="search-field">
          <span className="sr-only">Search scholarships</span>
          <Icon name="search" size={18} />
          <input
            type="search"
            placeholder="Search by name, course or requirement"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="chip-row" aria-label="Offered for">
          {WHO.map((option) => (
            <button
              key={option.id}
              type="button"
              className="chip"
              data-uni={option.id === "all" ? undefined : option.id}
              aria-pressed={who === option.id}
              onClick={() => setWho(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="chip-row" aria-label="Type">
          {KINDS.map((option) => (
            <button
              key={option}
              type="button"
              className="chip chip-quiet"
              aria-pressed={kind === option}
              onClick={() => setKind(kind === option ? null : option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="empty-state">
          <strong>No scholarships match.</strong>
          <button type="button" className="button-quiet" onClick={clear}>
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <section className="chart-panel year" aria-labelledby="windows-title">
            <div className="chart-copy">
              <h2 id="windows-title" className="chart-title">
                When to apply
              </h2>
              <p className="chart-sub">
                {results.length} {results.length === 1 ? "scholarship" : "scholarships"}, next twelve
                months.
              </p>
            </div>
            <div className="year-scroll">
              <div className="year-grid windows-grid" role="table" aria-label="Application windows">
                <div className="year-row year-head" role="row">
                  <span className="year-label" role="columnheader">
                    <span className="sr-only">Scholarship</span>
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
                {results.map((item) => {
                  const open = new Set(item.applyMonths.map((month) => timelineColumn(month, today)));
                  return (
                    <div key={item.id} className="year-row" role="row" data-uni={brandOf(item)}>
                      <span className="year-label window-label" role="rowheader">
                        {item.name}
                      </span>
                      {item.applyMonths.length === 0 ? (
                        <span role="cell" className="window-note">
                          {item.windowNote}
                        </span>
                      ) : (
                        columns.map((month, index) => (
                          <span
                            key={month}
                            role="cell"
                            className={[
                              "year-cell",
                              index === 1 ? "is-today" : "",
                              open.has(index) ? "is-open" : "",
                              open.has(index) && !open.has(index - 1) ? "open-start" : "",
                              open.has(index) && !open.has(index + 1) ? "open-end" : "",
                            ].join(" ")}
                          >
                            {open.has(index) ? <span className="sr-only">Open in {month}</span> : null}
                          </span>
                        ))
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <ul className="scholarship-grid">
            {results.map((item) => (
              <li key={item.id} className="scholarship-card" data-uni={brandOf(item)}>
                <div className="scholarship-top">
                  <span className="kind-tag">{item.kind}</span>
                  <span className="scholarship-window">
                    <Icon name="calendar" size={15} />
                    {windowLabel(item)}
                  </span>
                </div>
                <h2 className="scholarship-name">{item.name}</h2>
                <p className="scholarship-provider">{item.provider}</p>
                <p className="scholarship-covers">{item.covers}</p>
                <ul className="scholarship-who">
                  {item.who.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <p className="scholarship-how">{item.howToApply}</p>
                <a className="scholarship-link" href={item.source} target="_blank" rel="noreferrer">
                  Official page
                  <Icon name="external" size={14} />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
