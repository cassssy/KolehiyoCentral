import { sharedRequirements, universities, type Requirement, type RequirementScope, type University } from "./data";
import { isRequirementDone, type ProgressState } from "./status";

/** One physical document, with every university that asks for it. */
export type DocumentItem = {
  key: string;
  requirement: Requirement;
  universities: University[];
  done: boolean;
  /** Ticking is blocked because the only application using it is submitted. */
  locked: boolean;
};

export const SCOPE_LABEL: Record<RequirementScope, string> = {
  shared: "Shared documents",
  school: "From your school",
  university: "University forms",
};

export const SCOPE_NOTE: Record<RequirementScope, string> = {
  shared: "Get once, use for every school that asks.",
  school: "Your registrar prepares these. They take the longest.",
  university: "Each school's own forms.",
};

export function listDocuments(state: ProgressState): DocumentItem[] {
  const shared = sharedRequirements.map((requirement) => {
    const using = universities.filter((university) =>
      university.requirements.some((item) => item.id === requirement.id && item.scope === "shared"),
    );
    return {
      key: `shared:${requirement.id}`,
      requirement,
      universities: using,
      done: state.sharedDone.includes(requirement.id),
      locked: false,
    };
  });

  const own = universities.flatMap((university) =>
    university.requirements
      .filter((requirement) => requirement.scope !== "shared")
      .map((requirement) => ({
        key: `${university.id}:${requirement.id}`,
        requirement,
        universities: [university],
        done: isRequirementDone(state, university.id, requirement),
        locked: Boolean(state.submitted[university.id]),
      })),
  );

  return [...shared, ...own];
}

export function summarize(items: DocumentItem[]) {
  const scopes: RequirementScope[] = ["shared", "school", "university"];
  return {
    done: items.filter((item) => item.done).length,
    total: items.length,
    byScope: scopes.map((scope) => {
      const group = items.filter((item) => item.requirement.scope === scope);
      return { scope, done: group.filter((item) => item.done).length, total: group.length };
    }),
  };
}
