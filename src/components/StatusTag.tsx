import { statusClass, type ApplicationStatus } from "../status";

export function StatusTag({ status }: { status: ApplicationStatus }) {
  return <span className={statusClass(status)}>{status}</span>;
}
