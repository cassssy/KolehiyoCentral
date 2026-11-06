import { applicant, sharedRequirements } from "../data";
import { useDemo } from "../store";

export function ProfilePage() {
  const { sharedDone, toggleShared, reset } = useDemo();

  return (
    <section className="profile-page">
      <header className="page-head">
        <h1>{applicant.name}</h1>
        <p>
          Shared with all four applications.
        </p>
      </header>

      <div className="profile-hero-card">
        <div className="profile-avatar-large" aria-hidden="true">
          JS
        </div>
        <div className="profile-info">
          <h2>{applicant.name}</h2>
          <p className="profile-sub">
            {applicant.level} Candidate · {applicant.school}
          </p>
          <dl className="profile-stats">
            <div className="stat-pill">
              <dt>General Average</dt>
              <dd>{applicant.gradeAverage}%</dd>
            </div>
            <div className="stat-pill">
              <dt>Origin Institution</dt>
              <dd>{applicant.school}</dd>
            </div>
            <div className="stat-pill">
              <dt>Academic Level</dt>
              <dd>{applicant.level}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="shared-docs-card">
        <div className="section-head">
          <h2 className="section-title">Shared documents</h2>
          <span className="section-meta">
            Tick once, counts for every school.
          </span>
        </div>
        <ul className="checklist shared-list">
          {sharedRequirements.map((requirement) => {
            const checked = sharedDone.includes(requirement.id);
            return (
              <li key={requirement.id}>
                <label className={checked ? "check done" : "check"}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleShared(requirement.id)}
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

      <div className="reset-card">
        <div className="reset-copy">
          <strong>Reset demo</strong>
          <p>
            Clears checklists, programs and dates.
          </p>
        </div>
        <button
          type="button"
          className="button-quiet"
          onClick={() => {
            if (window.confirm("Reset all checklists, programs and dates?")) {
              reset();
            }
          }}
        >
          Reset demo
        </button>
      </div>
    </section>
  );
}
