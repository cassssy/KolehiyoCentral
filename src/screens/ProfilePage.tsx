import { applicant } from "../data";

export function ProfilePage() {
  return (
    <section>
      <header className="page-head">
        <h1>{applicant.name}</h1>
        <p>
          {applicant.level}, {applicant.school}. This profile is shared by every application, so
          the name, school, and grade average are not retyped for each university.
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
    </section>
  );
}
