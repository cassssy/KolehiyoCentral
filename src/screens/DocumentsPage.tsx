import { useState } from "react";
import { DocumentSummary } from "../components/DocumentSummary";
import { Icon } from "../components/Icon";
import type { RequirementScope } from "../data";
import { listDocuments, SCOPE_LABEL, SCOPE_NOTE, type DocumentItem } from "../documents";
import { useDemo } from "../store";

type Filter = "all" | "todo" | "done";

const SCOPES: RequirementScope[] = ["shared", "school", "university"];

export function DocumentsPage() {
  const state = useDemo();
  const [filter, setFilter] = useState<Filter>("todo");
  const items = listDocuments(state);
  const todo = items.filter((item) => !item.done).length;

  const toggle = (item: DocumentItem) => {
    if (item.requirement.scope === "shared") state.toggleShared(item.requirement.id);
    else state.toggleRequirement(item.universities[0].id, item.requirement.id);
  };

  const shown = items.filter((item) =>
    filter === "all" ? true : filter === "todo" ? !item.done : item.done,
  );

  const options: { id: Filter; label: string; count: number }[] = [
    { id: "todo", label: "To do", count: todo },
    { id: "done", label: "Done", count: items.length - todo },
    { id: "all", label: "All", count: items.length },
  ];

  return (
    <section className="documents-page">
      <header className="page-head">
        <h1>Documents</h1>
        <p>Every document for all four applications. Tick it once and it counts everywhere it’s needed.</p>
      </header>

      <DocumentSummary title="Progress" />

      <div className="chip-row doc-filter" aria-label="Show">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className="chip"
            aria-pressed={filter === option.id}
            onClick={() => setFilter(option.id)}
          >
            {option.label}
            <span className="chip-count">{option.count}</span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="empty-state">
          <strong>{filter === "todo" ? "Nothing left to get." : "Nothing ticked yet."}</strong>
        </div>
      ) : (
        SCOPES.map((scope) => {
          const group = shown.filter((item) => item.requirement.scope === scope);
          if (group.length === 0) return null;
          return (
            <section key={scope} className="doc-group" aria-labelledby={`docs-${scope}`}>
              <div className="section-head">
                <h2 id={`docs-${scope}`} className="section-title">
                  {SCOPE_LABEL[scope]}
                </h2>
                <span className="section-meta">{SCOPE_NOTE[scope]}</span>
              </div>
              <ul className="doc-list">
                {group.map((item) => (
                  <li key={item.key} className={item.done ? "doc-row is-done" : "doc-row"}>
                    <label className="doc-check">
                      <input
                        type="checkbox"
                        checked={item.done}
                        disabled={item.locked}
                        onChange={() => toggle(item)}
                      />
                      <span className="doc-box" aria-hidden="true">
                        <Icon name="check" size={14} />
                      </span>
                      <span className="doc-label">{item.requirement.label}</span>
                    </label>
                    <span className="doc-unis">
                      {item.locked ? (
                        <span className="doc-locked">
                          <Icon name="lock" size={13} />
                          Submitted
                        </span>
                      ) : null}
                      {item.universities.map((university) => (
                        <span key={university.id} className="uni-pill" data-uni={university.id}>
                          {university.shortName}
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })
      )}
    </section>
  );
}
