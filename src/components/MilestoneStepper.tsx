import type { University } from "../data";
import { formatDate, type Application } from "../status";

export function MilestoneStepper({
  university,
  app,
}: {
  university: University;
  app: Application;
}) {
  const isChecklistDone = app.total > 0 && app.count === app.total;
  const isSubmitted = app.status === "Submitted";

  return (
    <div className="milestone-stepper" aria-label="Admission steps">
      {/* Step 1 */}
      <div className={`milestone-step ${isChecklistDone ? "is-done" : "is-active"}`}>
        <div className="milestone-indicator">
          {isChecklistDone ? (
            <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <span>1</span>
          )}
        </div>
        <div className="milestone-text">
          <strong className="milestone-title">Checklist</strong>
          <span className="milestone-sub">
            {isChecklistDone ? "All done" : `${app.count} of ${app.total} prepared`}
          </span>
        </div>
      </div>

      <div className={`milestone-divider ${isChecklistDone ? "is-done" : ""}`} />

      {/* Step 2 */}
      <div
        className={`milestone-step ${
          isSubmitted ? "is-done" : isChecklistDone ? "is-active is-ready" : "is-pending"
        }`}
      >
        <div className="milestone-indicator">
          {isSubmitted ? (
            <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <span>2</span>
          )}
        </div>
        <div className="milestone-text">
          <strong className="milestone-title">Submit on portal</strong>
          <span className="milestone-sub">
            {isSubmitted
              ? app.submittedOn
                ? `Submitted ${formatDate(app.submittedOn)}`
                : "Submitted on portal"
              : isChecklistDone
              ? "Ready to submit"
              : "Waiting on documents"}
          </span>
        </div>
      </div>

      <div className={`milestone-divider ${isSubmitted ? "is-done" : ""}`} />

      {/* Step 3 */}
      <div className={`milestone-step ${isSubmitted ? "is-active" : "is-pending"}`}>
        <div className="milestone-indicator">
          <span>3</span>
        </div>
        <div className="milestone-text">
          <strong className="milestone-title">{university.test} and results</strong>
          <span className="milestone-sub">
            Exam {university.examDates} · Results {university.releaseOfResults}
          </span>
        </div>
      </div>
    </div>
  );
}

