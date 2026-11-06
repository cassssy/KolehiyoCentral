import { Link, useParams } from "react-router-dom";
import { Icon } from "../components/Icon";
import { MilestoneStepper } from "../components/MilestoneStepper";
import { ProgressRing } from "../components/ProgressRing";
import { StatusTag } from "../components/StatusTag";
import { UniversityLogo } from "../components/UniversityLogo";
import { applicant, findUniversity, type Requirement } from "../data";
import { getApplication, isRequirementDone, opensLabel } from "../status";
import { scholarships } from "../scholarships";
import { useDemo } from "../store";

function ChecklistGroup({
  title,
  note,
  scope,
  items,
  isDone,
  disabled,
  onToggle,
}: {
  title: string;
  note?: string;
  scope: Requirement["scope"];
  items: Requirement[];
  isDone: (requirement: Requirement) => boolean;
  disabled: boolean;
  onToggle: (requirement: Requirement) => void;
}) {
  if (items.length === 0) return null;

  const scopeLabel =
    scope === "shared" ? "Shared" : scope === "school" ? "High School" : "University";

  return (
    <div className="checklist-group">
      <div className="checklist-group-header">
        <h3>{title}</h3>
        <span className={`scope-badge scope-${scope}`}>{scopeLabel}</span>
      </div>
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
                <span className="check-custom" aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="check-label">{requirement.label}</span>
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
          <Link to="/universities">Back to the universities</Link>
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
      ? `${app.missing.length} checklist ${app.missing.length === 1 ? "item" : "items"}`
      : null;

  return (
    <section className="uni-detail-page" data-uni={university.id}>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/universities" className="breadcrumb-link">
          <Icon name="back" size={16} />
          All universities
        </Link>
      </nav>

      <header className="uni-hero">
        <div className="uni-hero-main">
          <UniversityLogo id={university.id} name={university.shortName} />
          <div className="uni-hero-content">
            <div className="uni-hero-tags">
              <span className="uni-test-badge">{university.test}</span>
              <span className="uni-tag-pill">{university.shortName}</span>
            </div>
            <h1>{university.name}</h1>
            <p className="uni-intro">{university.intro}</p>
          </div>
        </div>
      </header>

      {/* 3-Stage Milestone Stepper */}
      <MilestoneStepper university={university} app={app} />

      {/* Celebration Banners */}
      {app.status === "Submitted" ? (
        <div className="celebration-banner is-submitted" role="status">
          <div className="celebration-icon" aria-hidden="true">
            <Icon name="celebrate" size={28} />
          </div>
          <div className="celebration-copy">
            <strong>Marked submitted</strong>
            <p>
              Watch the {university.shortName} portal for your {university.test} permit. Results
              come out in {university.releaseOfResults}.
            </p>
          </div>
          <button
            type="button"
            className="button-quiet"
            onClick={() => state.undoSubmitted(university.id)}
          >
            Reopen checklist
          </button>
        </div>
      ) : app.status === "Ready to submit" ? (
        <div className="celebration-banner is-ready" role="status">
          <div className="celebration-icon" aria-hidden="true">
            <Icon name="sparkle" size={28} />
          </div>
          <div className="celebration-copy">
            <strong>Ready to submit</strong>
            <p>
              Submit on the {university.shortName} portal ({opensLabel(period).toLowerCase()}), then
              mark it here.
            </p>
          </div>
          <button
            type="button"
            className="button-primary celebration-btn"
            onClick={() => state.markSubmitted(university.id)}
          >
            Mark as submitted
          </button>
        </div>
      ) : null}

      {/* Progress Card */}
      <div className={`progress-card status-${app.status.replace(/ /g, "-").toLowerCase()}`}>
        <div className="progress-card-top">
          <div className="progress-card-info">
            <div className="progress-status-row">
              <StatusTag status={app.status} />
              <span className="progress-count-text">
                <strong>{app.count}</strong> of <strong>{app.total}</strong> requirements done
              </span>
            </div>
            <div className="progress-program-badge">
              <span className="program-icon" aria-hidden="true">
                <Icon name="program" size={16} />
              </span>
              <span>
                {app.programName ? (
                  <>
                    Program: <strong>{app.programName}</strong>
                  </>
                ) : (
                  <em className="missing">No program yet</em>
                )}
              </span>
            </div>
          </div>
          <div className="progress-card-ring">
            <ProgressRing value={app.count} max={app.total} size={54} strokeWidth={4.5} />
          </div>
        </div>

        <div
          className="meter"
          role="meter"
          aria-valuemin={0}
          aria-valuemax={app.total}
          aria-valuenow={app.count}
          aria-label="Checklist completion percentage"
        >
          <span style={{ width: `${percent}%` }} />
        </div>

        {app.status === "Not started" || app.status === "In progress" ? (
          <div className="progress-card-guidance">
            <p>
              Still to do:{" "}
              {app.programName ? null : <a href="#programs">select a target program</a>}
              {!app.programName && missingItems ? " and complete " : null}
              {missingItems}.
            </p>
          </div>
        ) : null}
      </div>

      <div className="split">
        <div className="checklist-column">
          <div className="checklist-header-row">
            <h2>Checklist</h2>
            <span className="checklist-lock-note">
              {locked ? (
                <>
                  <Icon name="lock" size={14} />
                  Locked while submitted
                </>
              ) : (
                "Tick items as you get them"
              )}
            </span>
          </div>

          <ChecklistGroup
            title="Shared documents"
            scope="shared"
            note="Get once, use for every school."
            items={byScope("shared")}
            isDone={isDone}
            disabled={locked}
            onToggle={onToggle}
          />
          <ChecklistGroup
            title="High school records"
            scope="school"
            note={`Prepared by the ${applicant.school} registrar.`}
            items={byScope("school")}
            isDone={isDone}
            disabled={locked}
            onToggle={onToggle}
          />
          <ChecklistGroup
            title={`${university.shortName} forms`}
            scope="university"
            items={byScope("university")}
            isDone={isDone}
            disabled={locked}
            onToggle={onToggle}
          />
        </div>

        <aside className="side">
          <div className="side-card">
            <h2 className="side-title">Dates and fees</h2>
            <dl className="facts facts-stack">
              <div className="fact-item">
                <dt>Application window</dt>
                <dd>
                  <strong>{period}</strong> <span className="dd-note">({opensLabel(period)})</span>
                </dd>
              </div>
              <div className="fact-item">
                <dt>Entrance Exam ({university.test})</dt>
                <dd>
                  <strong>{university.examDates}</strong>
                </dd>
              </div>
              <div className="fact-item">
                <dt>Release of Results</dt>
                <dd>
                  <strong>{university.releaseOfResults}</strong>
                </dd>
              </div>
            </dl>
            <div className="aside-notes">
              <p className="aside-note">
                <Icon name="info" size={16} />
                <span>{university.feeNote}</span>
              </p>
              {university.rankingNote ? (
                <p className="aside-note">
                  <Icon name="pin" size={16} />
                  <span>{university.rankingNote}</span>
                </p>
              ) : null}
            </div>
          </div>

          <div className="side-card">
            <h2 className="side-title">Scholarships</h2>
            <ul className="side-scholarships">
              {scholarships
                .filter((item) => item.universityId === university.id || item.universityId === null)
                .map((item) => (
                  <li key={item.id}>
                    <Icon name="award" size={16} />
                    <span>
                      <strong>{item.name}</strong>
                      <span>{item.covers}</span>
                    </span>
                  </li>
                ))}
            </ul>
            <Link to="/scholarships" className="breadcrumb-link">
              All scholarships
              <Icon name="arrow" size={16} />
            </Link>
          </div>

          <fieldset id="programs" className="programs side-card" disabled={locked}>
            <legend className="side-title">
              <h2>Program</h2>
            </legend>
            <p className="programs-desc">
              Pick the degree you’re applying for.
            </p>
            <div className="program-options">
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
                    <div className="program-body">
                      <div className="program-name-row">
                        <strong className="program-name">{program.name}</strong>
                        {chosen ? <span className="choice-pill">Selected</span> : null}
                      </div>
                      <span className="program-summary">{program.summary}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </aside>
      </div>
    </section>
  );
}
