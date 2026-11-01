import { Link } from "react-router-dom";
import { Chevron } from "../components/Chevron";
import { chosenProgramName, universities } from "../data";
import { applicationStatus, doneCount, statusClass } from "../status";
import { useDemo } from "../store";

export function ApplicationsPage() {
  const { done } = useDemo();

  return (
    <section>
      <header className="page-head">
        <h1>My applications</h1>
        <p>
          Submitted means the checklist is finished in Kolehiyo Central. The university has not
          received it.
        </p>
      </header>
      <ul className="applications">
        {universities.map((university) => {
          const finished = done[university.id] ?? [];
          const status = applicationStatus(finished, university.requirements);
          const count = doneCount(finished, university.requirements);
          const verb =
            status === "In progress" ? "Continue" : status === "Not started" ? "Start" : "Review";
          return (
            <li key={university.id}>
              <Link className="application" to={`/universities/${university.id}`}>
                <div>
                  <h2>
                    {university.name} <span className="test">{university.test}</span>
                  </h2>
                  <p className="program-line">
                    {chosenProgramName(university)} · {count} of {university.requirements.length}
                  </p>
                </div>
                <span className="row-status">
                  <span className={statusClass(status)}>{status}</span>
                  <span className="open-label">
                    {verb} <Chevron />
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="aside-note">
        Ask Philippine High School for the school record as soon as applications open, and tell
        Ateneo’s two teachers to expect the portal email.
      </p>
    </section>
  );
}
