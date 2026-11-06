import { Link } from "react-router-dom";
import { Chevron } from "../components/Chevron";
import { Icon } from "../components/Icon";
import { RequirementBar } from "../components/RequirementBar";
import { StatusTag } from "../components/StatusTag";
import { UniversityLogo } from "../components/UniversityLogo";
import { actionLabel } from "../status";
import { useApplications } from "../store";

export function DirectoryPage() {
  const applications = useApplications();

  return (
    <section>
      <header className="page-head">
        <h1>Universities</h1>
        <p>The Big Four. Open one for its checklist and programs.</p>
      </header>

      <section className="universities-section" aria-label="Universities">

        <div className="uni-grid">
          {applications.map((item) => (
            <Link
              key={item.university.id}
              to={`/universities/${item.university.id}`}
              className="uni-card"
              data-uni={item.university.id}
            >
              <div className="uni-card-header">
                <UniversityLogo id={item.university.id} name={item.university.shortName} />
                <div className="uni-card-title-group">
                  <div className="uni-card-topline">
                    <span className="uni-test-badge">{item.university.test}</span>
                    <span className="uni-shortname">{item.university.shortName}</span>
                  </div>
                  <h3 className="uni-card-name">{item.university.name}</h3>
                </div>
              </div>

              <div className="uni-card-program">
                <span className="program-icon" aria-hidden="true">
                  <Icon name="program" size={16} />
                </span>
                <span className="program-text">
                  {item.programName ?? <em className="missing">No program yet</em>}
                </span>
              </div>

              <RequirementBar application={item} />

              <div className="uni-card-footer">
                <StatusTag status={item.status} />
                <span className="open-label">
                  {actionLabel(item.status)} <Chevron />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}
