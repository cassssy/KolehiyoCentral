import { applicant } from "./data";
import { formatDate, monthsUntil, type Application } from "./status";

/**
 * Parcel-tracking view of an application, in the style of a courier app:
 * the application is the parcel, the high school is the sorting facility,
 * the admissions office is the delivery hub, and the results are the delivery.
 */
export type TrackingEvent = {
  id: string;
  title: string;
  detail: string;
  /** When it happened or is expected, if known. */
  when?: string;
};

export type Tracking = {
  /** Reached events, newest first. The first one is the current status. */
  history: TrackingEvent[];
  /** Stops still ahead, in the order they will happen. */
  upcoming: TrackingEvent[];
  trackingNumber: string;
  estimatedDelivery: string;
};

export function trackingNumber(app: Application): string {
  const seed = [...app.university.id].reduce((sum, char) => sum * 31 + char.charCodeAt(0), 7);
  return `KC${app.university.shortName.toUpperCase()}${String(seed % 1_000_000).padStart(6, "0")}`;
}

export function getTracking(app: Application, today: Date = new Date()): Tracking {
  const { university } = app;
  const reached: TrackingEvent[] = [];
  const upcoming: TrackingEvent[] = [];
  const started = app.status !== "Not started";

  if (!started) {
    reached.push({
      id: "waiting",
      title: "Waiting for order",
      detail: "Choose a program or tick a checklist item to start this application.",
    });
  } else {
    reached.push({
      id: "placed",
      title: "Order placed",
      detail: `Application to ${university.name} started.`,
    });
  }

  if (app.programName) {
    reached.push({
      id: "program",
      title: "Order confirmed",
      detail: `Program: ${app.programName}.`,
    });
  }

  const packed = app.status === "Ready to submit" || app.status === "Submitted";
  if (started) {
    reached.push(
      packed
        ? {
            id: "packed",
            title: "Parcel packed, waiting for pickup",
            detail: `All ${app.total} documents are in the box. Submit on the ${university.shortName} portal.`,
          }
        : {
            id: "packing",
            title: "Parcel is being packed",
            detail: `${app.count} of ${app.total} documents in the box.`,
          },
    );
  } else {
    upcoming.push({ id: "packing", title: "Parcel is being packed", detail: "Gather your documents." });
  }

  if (app.submittedOn) {
    const on = formatDate(app.submittedOn);
    reached.push({
      id: "departed",
      title: "Parcel has departed from sorting facility",
      detail: `Submitted from ${applicant.school}.`,
      when: on,
    });
    reached.push({
      id: "arrived",
      title: `Your parcel has arrived at the delivery hub: ${university.hub}`,
      detail: `Watch the ${university.shortName} portal for your ${university.test} permit.`,
      when: on,
    });
  } else {
    if (!packed && started) {
      upcoming.push({
        id: "packed",
        title: "Parcel packed, waiting for pickup",
        detail: "Every document checked off.",
      });
    }
    upcoming.push(
      { id: "departed", title: "Parcel departs sorting facility", detail: `Submit on the ${university.shortName} portal.` },
      { id: "arrived", title: "Arrives at delivery hub", detail: university.hub },
    );
  }

  const examEvent: TrackingEvent = {
    id: "out-for-delivery",
    title: "Out for delivery",
    detail: `${university.test} entrance exam.`,
    when: university.examDates,
  };
  const resultsEvent: TrackingEvent = {
    id: "delivered",
    title: "Delivered",
    detail: `${university.test} results released.`,
    when: university.releaseOfResults,
  };

  // Once submitted, the exam month is when the parcel is "out for delivery".
  if (app.submittedOn && monthsUntil(university.examDates, today) === 0) {
    reached.push({ ...examEvent, detail: `${university.test} is this month. Bring your permit.` });
  } else {
    upcoming.push(examEvent);
  }
  upcoming.push(resultsEvent);

  return {
    history: reached.reverse(),
    upcoming,
    trackingNumber: trackingNumber(app),
    estimatedDelivery: university.releaseOfResults,
  };
}

/** The latest event, for one-line previews. */
export function latestUpdate(app: Application): TrackingEvent {
  return getTracking(app).history[0];
}
