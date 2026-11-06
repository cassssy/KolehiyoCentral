import { Link } from "react-router-dom";
import { listDocuments, SCOPE_LABEL, summarize } from "../documents";
import { useDemo } from "../store";
import { Icon } from "./Icon";

/** Done-versus-total bars for each kind of document. */
export function DocumentSummary({
  title = "Documents",
  preview = false,
}: {
  title?: string;
  /** Dashboard version: also lists the next documents to get and links to the full page. */
  preview?: boolean;
}) {
  const state = useDemo();
  const items = listDocuments(state);
  const { done, total, byScope } = summarize(items);
  // School records take the longest, so they lead the list.
  const order = { school: 0, university: 1, shared: 2 } as const;
  const nextUp = items
    .filter((item) => !item.done && !item.locked)
    .sort((a, b) => order[a.requirement.scope] - order[b.requirement.scope])
    .slice(0, 3);

  return (
    <section className="chart-panel doc-summary" aria-labelledby="doc-summary-title">
      <div className="doc-summary-head">
        <h2 id="doc-summary-title" className="chart-title">
          {title}
        </h2>
        <p className="doc-total">
          <strong>{done}</strong> of {total} ready
        </p>
      </div>
      <ul className="scope-bars">
        {byScope.map((group) => {
          const percent = group.total > 0 ? (group.done / group.total) * 100 : 0;
          return (
            <li key={group.scope} data-scope={group.scope}>
              <span className="scope-name">{SCOPE_LABEL[group.scope]}</span>
              <span
                className="scope-track"
                role="img"
                aria-label={`${group.done} of ${group.total} done`}
              >
                <span className="scope-fill" style={{ width: `${percent}%` }} />
              </span>
              <span className="scope-count">
                {group.done}/{group.total}
              </span>
            </li>
          );
        })}
      </ul>
      {preview && nextUp.length > 0 ? (
        <div className="doc-next">
          <h3 className="doc-next-title">Get next</h3>
          <ul>
            {nextUp.map((item) => (
              <li key={item.key}>
                <span className="doc-next-label">{item.requirement.label}</span>
                {item.universities.map((university) => (
                  <span key={university.id} className="uni-pill" data-uni={university.id}>
                    {university.shortName}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {preview ? (
        <Link to="/documents" className="panel-link">
          Open documents
          <Icon name="arrow" size={16} />
        </Link>
      ) : null}
    </section>
  );
}
