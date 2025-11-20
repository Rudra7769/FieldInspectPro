import { create } from 'zustand';
import { Assignment, Job, QueuedJob } from '../types';

interface JobState {
  assignments: Assignment[];
  jobs: Job[];
  queuedJobs: QueuedJob[];
  isLoading: boolean;
  fetchAssignments: () => Promise<void>;
  fetchJobs: () => Promise<void>;
  addJob: (job: Job) => void;
  addToQueue: (job: QueuedJob) => void;
  removeFromQueue: (jobId: string) => void;
  updateQueuedJob: (jobId: string, updates: Partial<QueuedJob>) => void;
}

export const useJobStore = create<JobState>((set, get) => ({
  assignments: [],
  jobs: [],
  queuedJobs: [],
  isLoading: false,

  fetchAssignments: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('https://api.placeholder.com/engineer/assignments');
      const data = await response.json();
      set({ assignments: data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  fetchJobs: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('https://api.placeholder.com/engineer/jobs');
      const data = await response.json();
      set({ jobs: data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  addJob: (job: Job) => {
    set((state) => ({ jobs: [job, ...state.jobs] }));
  },

  addToQueue: (job: QueuedJob) => {
    set((state) => ({ queuedJobs: [...state.queuedJobs, job] }));
  },

  removeFromQueue: (jobId: string) => {
    set((state) => ({
      queuedJobs: state.queuedJobs.filter((job) => job.id !== jobId),
    }));
  },

  updateQueuedJob: (jobId: string, updates: Partial<QueuedJob>) => {
    set((state) => ({
      queuedJobs: state.queuedJobs.map((job) =>
        job.id === jobId ? { ...job, ...updates } : job
      ),
    }));
  },
}));
