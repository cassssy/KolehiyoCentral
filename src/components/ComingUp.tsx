import { Link } from "react-router-dom";
import type { Month } from "../data";
import { scholarships } from "../scholarships";
import { timelineColumn, whenLabel } from "../status";
import { useApplications, useDemo } from "../store";

type Event = {
  key: string;
  month: Month;
  title: string;
  kind: "Application" | "Exam" | "Results" | "Scholarship";
  brand: string;
  to: string;
};

/** The next few dated events across applications and scholarships. */
export function ComingUp({ limit = 6 }: { limit?: number }) {
  const { periods } = useDemo();
  const applications = useApplications();

  const events: Event[] = [
    ...applications.flatMap((item) => {
      const uni = item.university;
      const to = `/universities/${uni.id}`;
      const list: Event[] = [
        { key: `${uni.id}-exam`, month: uni.examDates, title: `${uni.test} exam`, kind: "Exam", brand: uni.id, to },
        { key: `${uni.id}-results`, month: uni.releaseOfResults, title: `${uni.shortName} results`, kind: "Results", brand: uni.id, to },
      ];
      if (item.status !== "Submitted") {
        list.unshift({
          key: `${uni.id}-opens`,
          month: periods[uni.id],
          title: `${uni.shortName} application opens`,
          kind: "Application",
          brand: uni.id,
          to,
        });
      }
      return list;
    }),
    ...scholarships
      .filter((item) => item.applyMonths.length > 0)
      .map((item) => ({
        key: item.id,
        month: item.applyMonths[0],
        title: item.name,
        kind: "Scholarship" as const,
        brand: item.government ? "gov" : item.universityId ?? "gov",
        to: "/scholarships",
      })),
  ];

  const upcoming = events
    // An exam or result from last month is over; an application window from last month may still be open.
    .filter((event) => !((event.kind === "Exam" || event.kind === "Results") && timelineColumn(event.month) === 0))
    .sort((a, b) => timelineColumn(a.month) - timelineColumn(b.month))
    .slice(0, limit);

  return (
    <section className="chart-panel coming-up" aria-labelledby="coming-up-title">
      <h2 id="coming-up-title" className="chart-title">
        Coming up
      </h2>
      <ol className="event-list">
        {upcoming.map((event) => (
          <li key={event.key} data-uni={event.brand}>
            <Link to={event.to} className="event">
              <span className="event-month">
                <strong>{event.month.slice(0, 3)}</strong>
              </span>
              <span className="event-body">
                <strong>{event.title}</strong>
                <span>
                  {event.kind} · {whenLabel(event.month)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
