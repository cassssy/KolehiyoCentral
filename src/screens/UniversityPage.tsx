import { Link, useParams } from "react-router-dom";
import { StatusTag } from "../components/StatusTag";
import { applicant, findUniversity, type Requirement } from "../data";
import { formatDate, getApplication, isRequirementDone, opensLabel } from "../status";
import { useDemo } from "../store";

function ChecklistGroup({
  title,
  note,
  items,
  isDone,
  disabled,
  onToggle,
}: {
  title: string;
  note?: string;
  items: Requirement[];
  isDone: (requirement: Requirement) => boolean;
  disabled: boolean;
  onToggle: (requirement: Requirement) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="group">
      <h3>{title}</h3>
      {note ? <p className="group-note">{note}</p> : null}
      <ul className="checklist">
        {items.map((requirement) => {
          const checked = isDone(requirement);
          return (
            <li key={requirement.id}>
              <label className={checked ? "check done" : "check"}>
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => onToggle(requirement)}
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
  const state = useDemo();

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

  const app = getApplication(university, state);
  const locked = app.status === "Submitted";
  const period = state.periods[university.id];
  const percent = app.total === 0 ? 0 : Math.round((app.count / app.total) * 100);
  const byScope = (scope: Requirement["scope"]) =>
    university.requirements.filter((item) => item.scope === scope);
  const isDone = (requirement: Requirement) =>
    isRequirementDone(state, university.id, requirement);
  const onToggle = (requirement: Requirement) =>
    requirement.scope === "shared"
      ? state.toggleShared(requirement.id)
      : state.toggleRequirement(university.id, requirement.id);

  const missingItems =
    app.missing.length > 0
      ? `${app.missing.length} checklist ${app.missing.length === 1 ? "item" : "items"} left`
      : null;

  return (
    <section>
      <p className="back">
        <Link to="/">All universities</Link>
      </p>
      <header className="page-head">
        <div className="title-lockup">
          <span className="mark" aria-hidden="true">
            {university.shortName}
          </span>
          <h1>{university.name}</h1>
        </div>
        <p>{university.intro}</p>
      </header>

      <div className={`progress-block progress-${app.status.replace(/ /g, "-").toLowerCase()}`}>
        <div className="progress-copy">
          <StatusTag status={app.status} />
          <strong>
            {app.count} of {app.total} done
          </strong>
          <span className="program-line">
            {app.programName ? `Program: ${app.programName}` : "No program chosen yet"}
          </span>
        </div>
        <div
          className="meter"
          role="meter"
          aria-valuemin={0}
          aria-valuemax={app.total}
          aria-valuenow={app.count}
          aria-label="Checklist progress"
        >
          <span style={{ width: `${percent}%` }} />
        </div>
        <div className="progress-action" aria-live="polite">
          {app.status === "Submitted" && app.submittedOn ? (
            <>
              <p>
                Marked submitted on {formatDate(app.submittedOn)}. Watch the {university.test}{" "}
                portal for your exam permit; results come out in {university.releaseOfResults}.
              </p>
              <button
                type="button"
                className="button-quiet"
                onClick={() => state.undoSubmitted(university.id)}
              >
                Undo
              </button>
            </>
          ) : app.status === "Ready to submit" ? (
            <>
              <p>
                Everything is ready. Submit on the {university.shortName} portal (
                {opensLabel(period).toLowerCase()}), then mark it here.
              </p>
              <button
                type="button"
                className="button-primary"
                onClick={() => state.markSubmitted(university.id)}
              >
                Mark as submitted
              </button>
            </>
          ) : (
            <p>
              To be ready to submit:{" "}
              {app.programName ? null : <a href="#programs">choose a program</a>}
              {!app.programName && missingItems ? " and finish " : null}
              {missingItems}.
            </p>
          )}
        </div>
      </div>

      <div className="split">
        <div>
          <h2>Checklist</h2>
          <p className="lede">
            {locked
              ? "Locked while this application is marked submitted. Undo to change it."
              : "Tick a line when you have it. The status above follows the ticks."}
          </p>
          <ChecklistGroup
            title="Bring these"
            note="Shared with every university. Ticking one here ticks it everywhere."
            items={byScope("shared")}
            isDone={isDone}
            disabled={locked}
            onToggle={onToggle}
          />
          <ChecklistGroup
            title={`Ask ${applicant.school}`}
            items={byScope("school")}
            isDone={isDone}
            disabled={locked}
            onToggle={onToggle}
          />
          <ChecklistGroup
            title={`${university.shortName} also asks for`}
            items={byScope("university")}
            isDone={isDone}
            disabled={locked}
            onToggle={onToggle}
          />
        </div>

        <aside className="side">
          <h2>When</h2>
          <dl className="facts facts-stack">
            <div>
              <dt>Application period</dt>
              <dd>
                {period} <span className="dd-note">{opensLabel(period)}</span>
              </dd>
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

          <fieldset id="programs" className="programs" disabled={locked}>
            <legend>
              <h2>Choose a program</h2>
            </legend>
            {university.programs.map((program) => {
              const chosen = program.id === app.programId;
              return (
                <label key={program.id} className={chosen ? "program chosen" : "program"}>
                  <input
                    type="radio"
                    name={`program-${university.id}`}
                    value={program.id}
                    checked={chosen}
                    onChange={() => state.chooseProgram(university.id, program.id)}
                  />
                  <span>
                    <span className="program-name">{program.name}</span>
                    <span className="program-summary">{program.summary}</span>
                    {chosen ? (
                      <span className="choice">{applicant.name.split(" ")[0]}’s choice</span>
                    ) : null}
                  </span>
                </label>
              );
            })}
          </fieldset>
        </aside>
      </div>
    </section>
  );
}
