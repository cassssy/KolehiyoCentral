import { MONTHS, programName, type Month, type Requirement, type University } from "./data";

export type ApplicationStatus = "Not started" | "In progress" | "Ready to submit" | "Submitted";

/** The slice of app state that application progress is derived from. */
export type ProgressState = {
  sharedDone: readonly string[];
  done: Readonly<Record<string, readonly string[]>>;
  programs: Readonly<Record<string, string | null>>;
  submitted: Readonly<Record<string, string | null>>;
};

export type NextStep =
  | { kind: "choose-program" }
  | { kind: "requirement"; requirement: Requirement }
  | { kind: "submit" }
  | { kind: "none" };

export type Application = {
  university: University;
  status: ApplicationStatus;
  count: number;
  total: number;
  missing: Requirement[];
  programId: string | null;
  programName: string | null;
  submittedOn: string | null;
  next: NextStep;
};

export function isRequirementDone(
  state: Pick<ProgressState, "sharedDone" | "done">,
  universityId: string,
  requirement: Requirement,
): boolean {
  const list = requirement.scope === "shared" ? state.sharedDone : state.done[universityId] ?? [];
  return list.includes(requirement.id);
}

export function getApplication(university: University, state: ProgressState): Application {
  const missing = university.requirements.filter(
    (item) => !isRequirementDone(state, university.id, item),
  );
  const total = university.requirements.length;
  const count = total - missing.length;
  const programId = state.programs[university.id] ?? null;
  const name = programName(university, programId);
  const submittedOn = state.submitted[university.id] ?? null;

  let status: ApplicationStatus;
  if (submittedOn) status = "Submitted";
  else if (missing.length === 0 && name) status = "Ready to submit";
  // Shared documents alone don't count as starting a university's application.
  else if (name || university.requirements.some(
    (item) => item.scope !== "shared" && isRequirementDone(state, university.id, item),
  )) status = "In progress";
  else status = "Not started";

  let next: NextStep;
  if (submittedOn) next = { kind: "none" };
  else if (!name) next = { kind: "choose-program" };
  else if (missing.length > 0) next = { kind: "requirement", requirement: missing[0] };
  else next = { kind: "submit" };

  return {
    university,
    status,
    count,
    total,
    missing,
    programId,
    programName: name,
    submittedOn,
    next,
  };
}

export function nextStepLabel(next: NextStep): string {
  switch (next.kind) {
    case "choose-program":
      return "Choose a program";
    case "requirement":
      return next.requirement.label;
    case "submit":
      return "Submit on the university portal";
    case "none":
      return "Nothing left to do";
  }
}

export function actionLabel(status: ApplicationStatus): string {
  switch (status) {
    case "Not started":
      return "Start";
    case "In progress":
      return "Continue";
    case "Ready to submit":
      return "Submit";
    case "Submitted":
      return "Review";
  }
}

export function statusClass(status: ApplicationStatus): string {
  return `status status-${status.replace(/ /g, "-").toLowerCase()}`;
}

/**
 * Months from `today` until the application period opens, from -1 to 10.
 * -1 means it opened last month: windows usually run a few weeks, so it may
 * still be open and is the most urgent, not eleven months away.
 */
export function monthsUntil(month: Month, today: Date = new Date()): number {
  const months = (MONTHS.indexOf(month) - today.getMonth() + 12) % 12;
  return months === 11 ? -1 : months;
}

export function opensLabel(month: Month, today: Date = new Date()): string {
  const months = monthsUntil(month, today);
  if (months === -1) return "Opened last month";
  if (months === 0) return "Opens this month";
  if (months === 1) return "Opens next month";
  return `Opens in ${months} months`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** Twelve timeline columns, starting last month so a window that just opened still shows. */
export function timelineMonths(today: Date = new Date()): Month[] {
  const first = (today.getMonth() + 11) % 12;
  return Array.from({ length: 12 }, (_, index) => MONTHS[(first + index) % 12]);
}

/** Column of a month in timelineMonths: 0 is last month, 1 is this month. */
export function timelineColumn(month: Month, today: Date = new Date()): number {
  return monthsUntil(month, today) + 1;
}

/** Relative month for a dated event: "Last month", "This month", "Next month", "In 4 months". */
export function whenLabel(month: Month, today: Date = new Date()): string {
  const months = monthsUntil(month, today);
  if (months === -1) return "Last month";
  if (months === 0) return "This month";
  if (months === 1) return "Next month";
  return `In ${months} months`;
}
