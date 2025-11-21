import { create } from "zustand";

interface TimerState {
  isRunning: boolean;
  startTime: number | null;
  start: () => void;
  stop: () => number | null; // returns elapsedMs
}

export const useTimerStore = create<TimerState>((set, get) => ({
  isRunning: false,
  startTime: null,
  start: () => {
    set({ isRunning: true, startTime: Date.now() });
  },
  stop: () => {
    const { isRunning, startTime } = get();
    if (!isRunning || !startTime) {
      return null;
    }
    const elapsedMs = Date.now() - startTime;
    set({ isRunning: false, startTime: null });
    return elapsedMs;
  },
}));
