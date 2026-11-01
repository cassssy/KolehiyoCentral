import { Link } from "react-router-dom";
import { Chevron } from "../components/Chevron";
import { chosenProgramName, universities, type University } from "../data";
import { applicationStatus, doneCount, statusClass, type ApplicationStatus } from "../status";
import { useDemo } from "../store";

type Row = {
  university: University;
  status: ApplicationStatus;
  count: number;
};

function actionLabel(status: ApplicationStatus): string {
  if (status === "In progress") return "Continue";
  if (status === "Not started") return "Start";
  return "Review";
}

export function DirectoryPage() {
  const { periods, done } = useDemo();
  const rows: Row[] = universities.map((university) => {
    const finished = done[university.id] ?? [];
    return {
      university,
      status: applicationStatus(finished, university.requirements),
      count: doneCount(finished, university.requirements),
    };
  });
  const open = rows.filter((row) => row.status !== "Submitted");

  return (
    <section>
      <header className="page-head">
        <h1 className="lead">Four universities, one checklist.</h1>
        <p>
          {open.length === 0
            ? "Every checklist is finished. Submitted means it is done here, not that the university has received it."
            : `${open.length === 1 ? "One application still needs work" : `${open.length} applications still need work`}. Open a university, tick what you have, and the status follows.`}
        </p>
      </header>

      {open.length > 0 ? (
        <ul className="next-list">
          {open.map((row) => (
            <li key={row.university.id}>
              <Link className="next" to={`/universities/${row.university.id}`}>
                <span>
                  <strong>
                    {actionLabel(row.status)} {row.university.shortName}
                  </strong>
                  <span className="next-meta">
                    {row.count} of {row.university.requirements.length} · {row.status}
                  </span>
                </span>
                <Chevron />
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      <h2 className="section-title">The Big Four</h2>
      <ul className="directory">
        {rows.map((row) => (
          <li key={row.university.id}>
            <Link className="uni-row" to={`/universities/${row.university.id}`}>
              <div className="uni-id">
                <h3>
                  {row.university.name}{" "}
                  <span className="test">{row.university.test}</span>
                </h3>
                <p className="program-line">{chosenProgramName(row.university)}</p>
              </div>
              <dl className="facts">
                <div>
                  <dt>Apply</dt>
                  <dd>{periods[row.university.id]}</dd>
                </div>
                <div>
                  <dt>Exam</dt>
                  <dd>{row.university.examDates}</dd>
                </div>
                <div>
                  <dt>Results</dt>
                  <dd>{row.university.releaseOfResults}</dd>
                </div>
              </dl>
              <div className="row-status">
                <span className={statusClass(row.status)}>{row.status}</span>
                <span className="count">
                  {row.count} of {row.university.requirements.length}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
