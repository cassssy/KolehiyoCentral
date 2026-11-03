import { MONTHS, universities, type Month } from "../data";
import { opensLabel } from "../status";
import { useDemo } from "../store";

export function PeriodsPage() {
  const { periods, setApplicationPeriod } = useDemo();

  return (
    <section>
      <header className="page-head">
        <h1>Sample dates</h1>
        <p>
          These are the months each university opens applications. Change one and the “What’s
          next” order on the home page follows. Checklists stay as they are.
        </p>
      </header>
      <form className="periods" onSubmit={(event) => event.preventDefault()}>
        {universities.map((university) => {
          const id = `period-${university.id}`;
          return (
            <div key={university.id} className="period">
              <label htmlFor={id}>
                {university.shortName}
                <span className="test"> {university.test}</span>
              </label>
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
              <span className="period-hint">
                {opensLabel(periods[university.id])} · exam in {university.examDates}
              </span>
            </div>
          );
        })}
      </form>
    </section>
  );
}
