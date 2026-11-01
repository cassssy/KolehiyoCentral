import type { Requirement } from "./data";

export type ApplicationStatus = "Not started" | "In progress" | "Submitted";

export function applicationStatus(
  done: readonly string[],
  requirements: readonly Requirement[],
): ApplicationStatus {
  const finished = requirements.filter((item) => done.includes(item.id)).length;
  if (finished === 0) return "Not started";
  if (finished === requirements.length) return "Submitted";
  return "In progress";
}

export function statusClass(status: ApplicationStatus): string {
  return `status status-${status.replace(" ", "-").toLowerCase()}`;
}

export function doneCount(
  done: readonly string[],
  requirements: readonly Requirement[],
): number {
  return requirements.filter((item) => done.includes(item.id)).length;
}
