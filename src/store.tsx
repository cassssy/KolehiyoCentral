import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { universities } from "./data";

type DemoState = {
  periods: Record<string, string>;
  done: Record<string, string[]>;
  toggleRequirement: (universityId: string, requirementId: string) => void;
  setApplicationPeriod: (universityId: string, period: string) => void;
};

const DemoContext = createContext<DemoState | null>(null);

const initialPeriods = Object.fromEntries(
  universities.map((university) => [university.id, university.applicationPeriod]),
);

const initialDone = Object.fromEntries(
  universities.map((university) => [university.id, university.initialDone]),
);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [periods, setPeriods] = useState<Record<string, string>>(initialPeriods);
  const [done, setDone] = useState<Record<string, string[]>>(initialDone);

  const value = useMemo<DemoState>(
    () => ({
      periods,
      done,
      toggleRequirement: (universityId, requirementId) => {
        setDone((current) => {
          const list = current[universityId] ?? [];
          const next = list.includes(requirementId)
            ? list.filter((id) => id !== requirementId)
            : [...list, requirementId];
          return { ...current, [universityId]: next };
        });
      },
      setApplicationPeriod: (universityId, period) => {
        setPeriods((current) => ({ ...current, [universityId]: period }));
      },
    }),
    [periods, done],
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
