import type { Application } from "../status";
import { getTracking } from "../tracking";
import { Icon } from "./Icon";

export function ParcelTracker({ app }: { app: Application }) {
  const tracking = getTracking(app);
  const [current, ...past] = tracking.history;

  return (
    <section className="tracker" aria-labelledby="tracker-title">
      <header className="tracker-head">
        <div className="tracker-current">
          <span className="tracker-truck" aria-hidden="true">
            <Icon name="truck" size={22} />
          </span>
          <div>
            <h2 id="tracker-title">{current.title}</h2>
            <p>Estimated delivery: results in {tracking.estimatedDelivery}</p>
          </div>
        </div>
        <dl className="tracker-ids">
          <div>
            <dt>Courier</dt>
            <dd>KC Express</dd>
          </div>
          <div>
            <dt>Tracking no.</dt>
            <dd className="tracker-number">{tracking.trackingNumber}</dd>
          </div>
        </dl>
      </header>

      <ol className="tracker-timeline">
        {[current, ...past].map((event, index) => (
          <li key={event.id} className={index === 0 ? "tracker-event is-current" : "tracker-event"}>
            <span className="tracker-dot" aria-hidden="true" />
            <div className="tracker-copy">
              <strong>{event.title}</strong>
              <span>{event.detail}</span>
              {event.when ? <time>{event.when}</time> : null}
            </div>
          </li>
        ))}
      </ol>

      {tracking.upcoming.length > 0 ? (
        <details className="tracker-next">
          <summary>Next stops ({tracking.upcoming.length})</summary>
          <ol className="tracker-timeline is-upcoming">
            {tracking.upcoming.map((event) => (
              <li key={event.id} className="tracker-event">
                <span className="tracker-dot" aria-hidden="true" />
                <div className="tracker-copy">
                  <strong>{event.title}</strong>
                  <span>{event.detail}</span>
                  {event.when ? <time>Expected {event.when}</time> : null}
                </div>
              </li>
            ))}
          </ol>
        </details>
      ) : null}
    </section>
  );
}
