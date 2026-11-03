import { Link } from "react-router-dom";
import { Chevron } from "../components/Chevron";
import { StatusTag } from "../components/StatusTag";
import { actionLabel, monthsUntil, nextStepLabel, opensLabel } from "../status";
import { useApplications, useDemo } from "../store";

export function DirectoryPage() {
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
    <section>
      <header className="page-head">
        <h1>Your applications, in one place.</h1>
        <p>
          {open.length === 0
            ? "Every application is marked submitted. Watch each university’s portal for exam permits and results."
            : `${open.length === 1 ? "One application needs" : `${open.length} applications need`} you${
                submitted > 0 ? `, and ${submitted} ${submitted === 1 ? "is" : "are"} submitted` : ""
              }. Here they are, the soonest to open first.`}
        </p>
      </header>

      {open.length > 0 ? (
        <>
          <h2 className="section-title">What’s next</h2>
          <ol className="next-list">
            {open.map((item) => {
              const period = periods[item.university.id];
              return (
                <li key={item.university.id}>
                  <Link
                    className={item.status === "Ready to submit" ? "next next-ready" : "next"}
                    to={`/universities/${item.university.id}`}
                  >
                    <span className="next-when">
                      <strong>{period}</strong>
                      <span>{opensLabel(period)}</span>
                    </span>
                    <span className="next-body">
                      <strong>
                        {actionLabel(item.status)} {item.university.shortName}
                      </strong>
                      <span className="next-meta">
                        Next: {nextStepLabel(item.next)}
                      </span>
                    </span>
                    <span className="next-count">
                      {item.count}/{item.total}
                      <Chevron />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </>
      ) : null}

      <h2 className="section-title">Universities</h2>
      <ul className="directory">
        <li className="dir-head" aria-hidden="true">
          <span>University</span>
          <span>Apply</span>
          <span>Exam</span>
          <span>Results</span>
          <span>Status</span>
        </li>
        {applications.map((item) => (
          <li key={item.university.id}>
            <Link className="uni-row" to={`/universities/${item.university.id}`}>
              <div className="uni-id">
                <span className="mark" aria-hidden="true">
                  {item.university.shortName}
                </span>
                <div>
                  <h3>{item.university.name}</h3>
                  <p className="program-line">
                    {item.programName ?? <em className="missing">No program chosen</em>} ·{" "}
                    {item.university.test}
                  </p>
                </div>
              </div>
              <dl className="facts">
                <div>
                  <dt>Apply</dt>
                  <dd>{periods[item.university.id]}</dd>
                </div>
                <div>
                  <dt>Exam</dt>
                  <dd>{item.university.examDates}</dd>
                </div>
                <div>
                  <dt>Results</dt>
                  <dd>{item.university.releaseOfResults}</dd>
                </div>
              </dl>
              <div className="row-status">
                <StatusTag status={item.status} />
                <span className="count">
                  {item.count} of {item.total}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
