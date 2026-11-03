import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { initialSharedDone, MONTHS, universities, type Month } from "./data";
import { getApplication, type ProgressState } from "./status";

type State = ProgressState & {
  periods: Record<string, Month>;
};

type Action =
  | { type: "toggle"; universityId: string; requirementId: string }
  | { type: "toggle-shared"; requirementId: string }
  | { type: "choose-program"; universityId: string; programId: string }
  | { type: "submit"; universityId: string; on: string }
  | { type: "unsubmit"; universityId: string }
  | { type: "set-period"; universityId: string; period: Month }
  | { type: "reset" };

type DemoState = State & {
  toggleRequirement: (universityId: string, requirementId: string) => void;
  toggleShared: (requirementId: string) => void;
  chooseProgram: (universityId: string, programId: string) => void;
  markSubmitted: (universityId: string) => void;
  undoSubmitted: (universityId: string) => void;
  setApplicationPeriod: (universityId: string, period: Month) => void;
  reset: () => void;
};

const STORAGE_KEY = "kolehiyo-central:v2";

function byUniversity<T>(pick: (university: (typeof universities)[number]) => T) {
  return Object.fromEntries(universities.map((university) => [university.id, pick(university)]));
}

function initialState(): State {
  return {
    sharedDone: initialSharedDone,
    done: byUniversity((university) => university.initialDone),
    programs: byUniversity((university) => university.initialProgramId),
    submitted: byUniversity(() => null),
    periods: byUniversity((university) => university.applicationPeriod),
  };
}

function toggle(list: readonly string[], id: string): string[] {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "toggle":
      if (state.submitted[action.universityId]) return state;
      return {
        ...state,
        done: {
          ...state.done,
          [action.universityId]: toggle(state.done[action.universityId] ?? [], action.requirementId),
        },
      };
    case "toggle-shared":
      return { ...state, sharedDone: toggle(state.sharedDone, action.requirementId) };
    case "choose-program":
      if (state.submitted[action.universityId]) return state;
      return { ...state, programs: { ...state.programs, [action.universityId]: action.programId } };
    case "submit":
      return { ...state, submitted: { ...state.submitted, [action.universityId]: action.on } };
    case "unsubmit":
      return { ...state, submitted: { ...state.submitted, [action.universityId]: null } };
    case "set-period":
      return { ...state, periods: { ...state.periods, [action.universityId]: action.period } };
    case "reset":
      return initialState();
  }
}

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Restore saved progress, keeping defaults for anything missing or malformed. */
function loadState(): State {
  const fallback = initialState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const saved: unknown = JSON.parse(raw);
    if (!isRecord(saved)) return fallback;
    const next = { ...fallback };
    if (isStringArray(saved.sharedDone)) next.sharedDone = saved.sharedDone;
    for (const { id, programs } of universities) {
      if (isRecord(saved.done) && isStringArray(saved.done[id])) {
        next.done = { ...next.done, [id]: saved.done[id] };
      }
      const program = isRecord(saved.programs) ? saved.programs[id] : undefined;
      if (typeof program === "string" && programs.some((item) => item.id === program)) {
        next.programs = { ...next.programs, [id]: program };
      }
      const submittedOn = isRecord(saved.submitted) ? saved.submitted[id] : undefined;
      if (typeof submittedOn === "string" && !Number.isNaN(Date.parse(submittedOn))) {
        next.submitted = { ...next.submitted, [id]: submittedOn };
      }
      const period = isRecord(saved.periods) ? saved.periods[id] : undefined;
      if (MONTHS.includes(period as Month)) {
        next.periods = { ...next.periods, [id]: period as Month };
      }
    }
    return next;
  } catch {
    return fallback;
  }
}

const DemoContext = createContext<DemoState | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage can be unavailable (private mode, quota); progress just won't persist.
    }
  }, [state]);

  const value = useMemo<DemoState>(
    () => ({
      ...state,
      toggleRequirement: (universityId, requirementId) =>
        dispatch({ type: "toggle", universityId, requirementId }),
      toggleShared: (requirementId) => dispatch({ type: "toggle-shared", requirementId }),
      chooseProgram: (universityId, programId) =>
        dispatch({ type: "choose-program", universityId, programId }),
      markSubmitted: (universityId) =>
        dispatch({ type: "submit", universityId, on: new Date().toISOString() }),
      undoSubmitted: (universityId) => dispatch({ type: "unsubmit", universityId }),
      setApplicationPeriod: (universityId, period) =>
        dispatch({ type: "set-period", universityId, period }),
      reset: () => dispatch({ type: "reset" }),
    }),
    [state],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoState {
  const value = useContext(DemoContext);
  if (!value) {
    throw new Error("useDemo must be used within DemoProvider");
  }
  return value;
}

/** Every application, derived from current state. */
export function useApplications() {
  const state = useDemo();
  return useMemo(
    () => universities.map((university) => getApplication(university, state)),
    [state],
  );
}
