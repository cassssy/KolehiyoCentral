import { universities } from "../data";
import { useDemo } from "../store";

export function PeriodsPage() {
  const { periods, setApplicationPeriod } = useDemo();

  return (
    <section>
      <header className="page-head">
        <h1>Sample dates</h1>
        <p>
          These months are what the universities show. Change one and the directory updates.
          Jordan’s checklist stays as it was.
        </p>
      </header>
      <form className="periods" onSubmit={(event) => event.preventDefault()}>
        {universities.map((university) => (
          <label key={university.id} className="period">
            <span>
              {university.shortName}
              <span className="test"> {university.test}</span>
            </span>
            <input
              aria-label={`${university.name} application period`}
              value={periods[university.id] ?? ""}
              onChange={(event) =>
                setApplicationPeriod(university.id, event.target.value)
              }
            />
          </label>
        ))}
      </form>
    </section>
  );
}
