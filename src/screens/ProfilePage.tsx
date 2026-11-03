import { applicant, sharedRequirements } from "../data";
import { useDemo } from "../store";

export function ProfilePage() {
  const { sharedDone, toggleShared, reset } = useDemo();

  return (
    <section>
      <header className="page-head">
        <h1>{applicant.name}</h1>
        <p>
          {applicant.level}, {applicant.school}. Every application shares this profile, so the
          name, school, grade average, and documents below are never entered twice.
        </p>
      </header>
      <dl className="profile">
        <div>
          <dt>Grade average</dt>
          <dd>{applicant.gradeAverage}</dd>
        </div>
        <div>
          <dt>School</dt>
          <dd>{applicant.school}</dd>
        </div>
        <div>
          <dt>Year</dt>
          <dd>{applicant.level}</dd>
        </div>
      </dl>

      <h2 className="section-title">Shared documents</h2>
      <p className="lede">
        Tick one here and it counts for every university that asks for it.
      </p>
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
                <span>{requirement.label}</span>
              </label>
            </li>
          );
        })}
      </ul>

      <div className="reset">
        <p>Your progress is saved in this browser.</p>
        <button
          type="button"
          className="button-quiet"
          onClick={() => {
            if (window.confirm("Reset every checklist, program, and date to the demo’s start?")) {
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
