import { Link } from "react-router-dom";
import { Chevron } from "../components/Chevron";
import { Icon } from "../components/Icon";
import { ProgressRing } from "../components/ProgressRing";
import { StatusTag } from "../components/StatusTag";
import { UniversityLogo } from "../components/UniversityLogo";
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
    <section className="applications-page">
      <header className="page-head">
        <h1>My applications</h1>
        <p>
          Prepare here, submit on each school’s portal, then mark it submitted.
        </p>
      </header>

      <ul className="applications-list">
        {applications.map((item) => (
          <li key={item.university.id}>
            <Link
              className="application-card"
              to={`/universities/${item.university.id}`}
              data-uni={item.university.id}
            >
              <div className="application-main">
                <UniversityLogo id={item.university.id} name={item.university.shortName} />
                <div className="application-body">
                  <div className="application-topline">
                    <span className="uni-test-badge">{item.university.test}</span>
                    <h2 className="application-name">{item.university.name}</h2>
                  </div>
                  <p className="application-program">
                    <Icon name="program" size={16} />
                    {item.programName ?? <em className="missing">No program chosen</em>}
                  </p>
                  <p className="next-line">
                    {item.submittedOn ? (
                      <span className="submitted-pill">
                        <Icon name="check" size={14} />
                        Marked submitted on {formatDate(item.submittedOn)}
                      </span>
                    ) : (
                      <span className="next-step-pill">Next: {nextStepLabel(item.next)}</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="application-meta">
                <div className="application-status-group">
                  <StatusTag status={item.status} />
                  <span className="open-label">
                    {actionLabel(item.status)} <Chevron />
                  </span>
                </div>
                <div className="application-ring">
                  <ProgressRing value={item.count} max={item.total} size={64} strokeWidth={6} />
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {schoolAsks.length > 0 ? (
        <aside className="registrar-callout" aria-labelledby="registrar-title">
          <div className="callout-header">
            <span className="callout-icon" aria-hidden="true">
              <Icon name="registrar" size={22} />
            </span>
            <div>
              <h2 id="registrar-title">Ask your registrar</h2>
              <p>
                School records take the longest. Request them early.
              </p>
            </div>
          </div>
          <ul className="registrar-items">
            {schoolAsks.map(({ university, requirement }) => (
              <li key={`${university.id}-${requirement.id}`} className="registrar-item">
                <span className="registrar-uni-tag" data-uni={university.id}>
                  {university.shortName}
                </span>
                <span className="registrar-doc">{requirement.label}</span>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
    </section>
  );
}
