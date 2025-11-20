import { create } from 'zustand';
import { Platform } from 'react-native';
import { Assignment, Job, QueuedJob } from '../types';
import * as db from '../services/database';

interface JobState {
  assignments: Assignment[];
  jobs: Job[];
  queuedJobs: QueuedJob[];
  isLoading: boolean;
  error: string | null;
  dbReady: boolean;
  fetchAssignments: () => Promise<void>;
  fetchJobs: () => Promise<void>;
  loadJobsFromDatabase: () => Promise<void>;
  loadQueuedJobsFromDatabase: () => Promise<void>;
  addJob: (job: Job) => Promise<void>;
  addToQueue: (job: QueuedJob) => Promise<void>;
  removeFromQueue: (jobId: string) => Promise<void>;
  updateQueuedJob: (jobId: string, updates: Partial<QueuedJob>) => void;
  setDbReady: (ready: boolean) => void;
}

const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: '1',
    societyName: 'Green Valley Apartments',
    flatNumbers: ['A-101', 'A-102', 'A-103'],
    address: '123 Main Street, Mumbai',
    urgency: 'high',
    status: 'pending',
  },
  {
    id: '2',
    societyName: 'Sunset Gardens',
    flatNumbers: ['B-205', 'B-206'],
    address: '456 Park Avenue, Pune',
    urgency: 'medium',
    status: 'pending',
  },
  {
    id: '3',
    societyName: 'Royal Heights',
    flatNumbers: ['C-304'],
    address: '789 Hill Road, Bangalore',
    urgency: 'low',
    status: 'pending',
  },
];

export const useJobStore = create<JobState>((set, get) => ({
  assignments: MOCK_ASSIGNMENTS,
  jobs: [],
  queuedJobs: [],
  isLoading: false,
  error: null,
  dbReady: false,

  fetchAssignments: async () => {
    set({ isLoading: true, assignments: MOCK_ASSIGNMENTS });
    set({ isLoading: false });
  },

  fetchJobs: async () => {
    await get().loadJobsFromDatabase();
  },

  loadJobsFromDatabase: async () => {
    if (Platform.OS === 'web') {
      set({ jobs: [], isLoading: false });
      return;
    }
    
    if (!get().dbReady) {
      const errorMessage = 'Database not ready';
      console.log(errorMessage);
      set({ isLoading: false, error: errorMessage });
      return;
    }
    
    set({ isLoading: true, error: null });
    try {
      const jobs = await db.getAllJobs();
      set({ jobs, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load jobs';
      console.error('Error loading jobs:', error);
      set({ isLoading: false, error: errorMessage });
    }
  },

  loadQueuedJobsFromDatabase: async () => {
    if (Platform.OS === 'web') {
      set({ queuedJobs: [] });
      return;
    }
    
    if (!get().dbReady) {
      const errorMessage = 'Database not ready';
      console.log(errorMessage);
      set({ error: errorMessage });
      return;
    }
    
    try {
      const queuedJobs = await db.getQueuedJobs();
      set({ queuedJobs, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load queued jobs';
      console.error('Error loading queued jobs:', error);
      set({ error: errorMessage });
    }
  },

  addJob: async (job: Job) => {
    if (Platform.OS !== 'web' && !get().dbReady) {
      throw new Error('Database not ready');
    }
    
    try {
      if (Platform.OS !== 'web') {
        await db.saveJob(job);
      }
      set((state) => ({ jobs: [job, ...state.jobs], error: null }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save job';
      console.error('Error adding job:', error);
      set({ error: errorMessage });
      throw error;
    }
  },

  addToQueue: async (job: QueuedJob) => {
    if (Platform.OS !== 'web' && !get().dbReady) {
      throw new Error('Database not ready');
    }
    
    try {
      if (Platform.OS !== 'web') {
        await db.addJobToQueue(job);
      }
      set((state) => ({ queuedJobs: [...state.queuedJobs, job], error: null }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add to queue';
      console.error('Error adding to queue:', error);
      set({ error: errorMessage });
      throw error;
    }
  },

  removeFromQueue: async (jobId: string) => {
    if (Platform.OS !== 'web' && !get().dbReady) {
      throw new Error('Database not ready');
    }
    
    try {
      if (Platform.OS !== 'web') {
        await db.removeJobFromQueue(jobId);
      }
      set((state) => ({
        queuedJobs: state.queuedJobs.filter((job) => job.id !== jobId),
        error: null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove from queue';
      console.error('Error removing from queue:', error);
      set({ error: errorMessage });
      throw error;
    }
  },

  updateQueuedJob: (jobId: string, updates: Partial<QueuedJob>) => {
    set((state) => ({
      queuedJobs: state.queuedJobs.map((job) =>
        job.id === jobId ? { ...job, ...updates } : job
      ),
    }));
  },

  setDbReady: (ready: boolean) => {
    set({ dbReady: ready });
  },
}));
