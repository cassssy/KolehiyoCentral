import type { Application } from "../status";

/** One block per requirement, filled once it is done. */
export function RequirementBar({ application }: { application: Application }) {
  const { university, missing, count, total } = application;
  const blocks = university.requirements.map((item) => ({
    id: item.id,
    done: !missing.some((m) => m.id === item.id),
  }));

  return (
    <div
      className="req-bar"
      role="img"
      aria-label={`${count} of ${total} requirements done`}
    >
      <span className="req-bar-blocks" aria-hidden="true">
        {blocks.map((block) => (
          <span key={block.id} className={block.done ? "req-block is-done" : "req-block"} />
        ))}
      </span>
      <span className="req-bar-count" aria-hidden="true">
        <strong>{count}</strong>/{total}
      </span>
    </div>
  );
}
