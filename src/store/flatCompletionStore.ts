import { create } from "zustand";

interface FlatCompletionState {
  completedFlats: Record<string, Set<string>>; // societyName -> set of flat ids
  finishedSocieties: Set<string>; // societies that have already triggered auto-finish
  markFlatCompleted: (societyName: string, flatId: string) => void;
  isFlatCompleted: (societyName: string, flatId: string) => boolean;
  markSocietyFinished: (societyName: string) => void;
  isSocietyFinished: (societyName: string) => boolean;
}

export const useFlatCompletionStore = create<FlatCompletionState>((set, get) => ({
  completedFlats: {},
  finishedSocieties: new Set<string>(),
  markFlatCompleted: (societyName, flatId) => {
    set((state) => {
      const current = new Set(state.completedFlats[societyName] || []);
      current.add(flatId);
      return {
        completedFlats: {
          ...state.completedFlats,
          [societyName]: current,
        },
      };
    });
  },
  isFlatCompleted: (societyName, flatId) => {
    const { completedFlats } = get();
    const setForSociety = completedFlats[societyName];
    return setForSociety ? setForSociety.has(flatId) : false;
  },
  markSocietyFinished: (societyName: string) => {
    set((state) => {
      const next = new Set(state.finishedSocieties);
      next.add(societyName);
      return { finishedSocieties: next };
    });
  },
  isSocietyFinished: (societyName: string) => {
    const { finishedSocieties } = get();
    return finishedSocieties.has(societyName);
  },
}));
