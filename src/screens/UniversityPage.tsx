import { Link, useParams } from "react-router-dom";
import { chosenProgramName, findUniversity, type Requirement } from "../data";
import { applicationStatus, doneCount, statusClass } from "../status";
import { useDemo } from "../store";

const broughtIds = new Set(["psa", "photo", "school-id", "lrn"]);

function ChecklistGroup({
  title,
  items,
  finished,
  onToggle,
}: {
  title: string;
  items: Requirement[];
  finished: string[];
  onToggle: (id: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="group">
      <h3>{title}</h3>
      <ul className="checklist">
        {items.map((requirement) => {
          const checked = finished.includes(requirement.id);
          return (
            <li key={requirement.id}>
              <label className={checked ? "check done" : "check"}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(requirement.id)}
                />
                <span>{requirement.label}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function UniversityPage() {
  const { universityId = "" } = useParams();
  const university = findUniversity(universityId);
  const { periods, done, toggleRequirement } = useDemo();

  if (!university) {
    return (
      <section className="page-head">
        <h1>That university is not in this demo.</h1>
        <p>
          <Link to="/">Back to the universities</Link>
        </p>
      </section>
    );
  }

  const finished = done[university.id] ?? [];
  const status = applicationStatus(finished, university.requirements);
  const count = doneCount(finished, university.requirements);
  const total = university.requirements.length;
  const brought = university.requirements.filter((item) => broughtIds.has(item.id));
  const record = university.requirements.filter((item) => item.id === "record");
  const extra = university.requirements.filter(
    (item) => !broughtIds.has(item.id) && item.id !== "record",
  );
  const percent = total === 0 ? 0 : Math.round((count / total) * 100);

  return (
    <section>
      <p className="back">
        <Link to="/">All universities</Link>
      </p>
      <header className="page-head">
        <h1>
          {university.name} <span className="test">{university.test}</span>
        </h1>
        <p>{university.intro}</p>
      </header>

      <div className="progress-block">
        <div className="progress-copy">
          <span className={statusClass(status)}>{status}</span>
          <strong>
            {count} of {total} done
          </strong>
          <span className="program-line">Chosen program: {chosenProgramName(university)}</span>
        </div>
        <div
          className="meter"
          role="meter"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={count}
          aria-label="Checklist progress"
        >
          <span style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div className="split">
        <div>
          <h2>Checklist</h2>
          <p className="lede">Tick a line when you have it. The status above follows the ticks.</p>
          <ChecklistGroup
            title="Bring these"
            items={brought}
            finished={finished}
            onToggle={(id) => toggleRequirement(university.id, id)}
          />
          <ChecklistGroup
            title="Ask Philippine High School"
            items={record}
            finished={finished}
            onToggle={(id) => toggleRequirement(university.id, id)}
          />
          <ChecklistGroup
            title={`${university.shortName} also asks for`}
            items={extra}
            finished={finished}
            onToggle={(id) => toggleRequirement(university.id, id)}
          />
        </div>

        <aside className="side">
          <h2>When</h2>
          <dl className="facts facts-stack">
            <div>
              <dt>Application period</dt>
              <dd>{periods[university.id]}</dd>
            </div>
            <div>
              <dt>Exam dates</dt>
              <dd>{university.examDates}</dd>
            </div>
            <div>
              <dt>Release of results</dt>
              <dd>{university.releaseOfResults}</dd>
            </div>
          </dl>
          <p className="aside-note">{university.feeNote}</p>
          {university.rankingNote ? <p className="aside-note">{university.rankingNote}</p> : null}

          <h2>Programs</h2>
          <ul className="programs">
            {university.programs.map((program) => {
              const chosen = program.id === university.chosenProgramId;
              return (
                <li key={program.id} className={chosen ? "program chosen" : "program"}>
                  <h3>{program.name}</h3>
                  <p>{program.summary}</p>
                  {chosen ? <span className="choice">Jordan’s choice</span> : null}
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </section>
  );
}
