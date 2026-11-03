import { Link } from "react-router-dom";
import { Chevron } from "../components/Chevron";
import { StatusTag } from "../components/StatusTag";
import { applicant } from "../data";
import { actionLabel, formatDate, nextStepLabel } from "../status";
import { useApplications } from "../store";

export function ApplicationsPage() {
  const applications = useApplications();
  const schoolAsks = applications.flatMap((item) =>
    item.status === "Submitted"
      ? []
      : item.missing
          .filter((requirement) => requirement.scope === "school")
          .map((requirement) => ({ university: item.university, requirement })),
  );

  return (
    <section>
      <header className="page-head">
        <h1>My applications</h1>
        <p>
          Tick the checklist here, submit on each university’s own portal, then mark it submitted
          so you can keep track.
        </p>
      </header>
      <ul className="applications">
        {applications.map((item) => (
          <li key={item.university.id}>
            <Link className="application" to={`/universities/${item.university.id}`}>
              <div className="uni-id">
                <span className="mark" aria-hidden="true">
                  {item.university.shortName}
                </span>
                <div>
                  <h2>{item.university.name}</h2>
                  <p className="program-line">
                    {item.programName ?? <em className="missing">No program chosen</em>} ·{" "}
                    {item.university.test} · {item.count} of {item.total}
                  </p>
                  <p className="next-line">
                    {item.submittedOn
                      ? `Marked submitted ${formatDate(item.submittedOn)}`
                      : `Next: ${nextStepLabel(item.next)}`}
                  </p>
                </div>
              </div>
              <span className="row-status">
                <StatusTag status={item.status} />
                <span className="open-label">
                  {actionLabel(item.status)} <Chevron />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {schoolAsks.length > 0 ? (
        <div className="callout">
          <h2>Ask {applicant.school}</h2>
          <p>The registrar prepares these. Request them early, since they take the longest.</p>
          <ul>
            {schoolAsks.map(({ university, requirement }) => (
              <li key={`${university.id}-${requirement.id}`}>
                <strong>{university.shortName}:</strong> {requirement.label}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
