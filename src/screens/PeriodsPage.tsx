import { UniversityLogo } from "../components/UniversityLogo";
import { MONTHS, universities, type Month } from "../data";
import { opensLabel } from "../status";
import { useDemo } from "../store";

export function PeriodsPage() {
  const { periods, setApplicationPeriod } = useDemo();

  return (
    <section className="periods-page">
      <header className="page-head">
        <h1>Admissions opening dates</h1>
        <p>
          Change a month to see the home page reorder.
        </p>
      </header>

      <form className="periods-grid" onSubmit={(event) => event.preventDefault()}>
        {universities.map((university) => {
          const id = `period-${university.id}`;
          return (
            <div key={university.id} className="period-card" data-uni={university.id}>
              <div className="period-card-header">
                <UniversityLogo id={university.id} name={university.shortName} />
                <div>
                  <div className="period-uni-row">
                    <span className="uni-test-badge">{university.test}</span>
                    <strong className="period-uni-name">{university.shortName}</strong>
                  </div>
                  <h2 className="period-uni-full">{university.name}</h2>
                </div>
              </div>

              <div className="period-select-wrap">
                <label htmlFor={id} className="period-label">
                  Application Opening Month
                </label>
                <div className="select-container">
                  <select
                    id={id}
                    value={periods[university.id]}
                    onChange={(event) =>
                      setApplicationPeriod(university.id, event.target.value as Month)
                    }
                  >
                    {MONTHS.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="period-card-footer">
                <span className="period-countdown-pill">{opensLabel(periods[university.id])}</span>
                <span className="period-exam-note">Exam in {university.examDates}</span>
              </div>
            </div>
          );
        })}
      </form>
    </section>
  );
}
