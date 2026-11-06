import { Link } from "react-router-dom";
import { Chevron } from "../components/Chevron";
import { ComingUp } from "../components/ComingUp";
import { DocumentSummary } from "../components/DocumentSummary";
import { ReadinessChart } from "../components/ReadinessChart";
import { ScholarshipSummary } from "../components/ScholarshipSummary";
import { YearTimeline } from "../components/YearTimeline";
import { actionLabel, monthsUntil, nextStepLabel, opensLabel } from "../status";
import { useApplications, useDemo } from "../store";

export function DashboardPage() {
  const { periods } = useDemo();
  const applications = useApplications();
  const open = applications
    .filter((item) => item.status !== "Submitted")
    .sort((a, b) => {
      // Finished checklists first, then whichever application window opens soonest.
      const ready = Number(b.status === "Ready to submit") - Number(a.status === "Ready to submit");
      return (
        ready ||
        monthsUntil(periods[a.university.id]) - monthsUntil(periods[b.university.id])
      );
    });
  const submitted = applications.length - open.length;

  return (
    <section className="dashboard">
      <header className="page-head">
        <h1>Dashboard</h1>
        <p>
          {open.length === 0
            ? "All four submitted. Watch each portal for exam permits and results."
            : `${open.length} open${submitted > 0 ? `, ${submitted} submitted` : ""}.`}
        </p>
      </header>

      <div className="charts">
        <ReadinessChart />
        <div className="dash-pair">
          <DocumentSummary preview />
          <ComingUp />
        </div>
      </div>

      {open.length > 0 ? (
        <section className="next-section" aria-labelledby="next-up-title">
          <div className="section-head">
            <h2 id="next-up-title" className="section-title">
              What’s next
            </h2>
            <span className="section-meta">Soonest first</span>
          </div>
          <ol className="next-list">
            {open.map((item) => {
              const period = periods[item.university.id];
              return (
                <li key={item.university.id}>
                  <Link
                    className={item.status === "Ready to submit" ? "next next-ready" : "next"}
                    to={`/universities/${item.university.id}`}
                    data-uni={item.university.id}
                  >
                    <span className="next-when">
                      <strong>{period}</strong>
                      <span>{opensLabel(period)}</span>
                    </span>
                    <span className="next-body">
                      <strong>
                        {actionLabel(item.status)} {item.university.shortName}
                      </strong>
                      <span className="next-meta">Next: {nextStepLabel(item.next)}</span>
                    </span>
                    <span className="next-count">
                      <span className="count-pill">
                        {item.count}/{item.total}
                      </span>
                      <Chevron />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      ) : null}

      <div className="charts dash-timeline">
        <ScholarshipSummary />
        <YearTimeline />
      </div>
    </section>
  );
}
