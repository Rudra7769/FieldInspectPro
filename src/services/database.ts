import { QueuedJob, Job } from '../types';

export const initializeDatabase = async () => {
  console.log('Database not available on web platform');
};

export const saveJob = async (job: Job): Promise<void> => {
  console.log('Database not available on web platform');
};

export const getAllJobs = async (): Promise<Job[]> => {
  return [];
};

export const updateJobSyncStatus = async (jobId: string, synced: boolean): Promise<void> => {
  console.log('Database not available on web platform');
};

export const deleteJob = async (jobId: string): Promise<void> => {
  console.log('Database not available on web platform');
};

export const addJobToQueue = async (job: QueuedJob): Promise<void> => {
  console.log('Database not available on web platform');
};

export const getQueuedJobs = async (): Promise<QueuedJob[]> => {
  return [];
};

export const removeJobFromQueue = async (jobId: string): Promise<void> => {
  console.log('Database not available on web platform');
};

export const updateQueuedJobRetry = async (jobId: string, retryCount: number, error?: string): Promise<void> => {
  console.log('Database not available on web platform');
};

export const clearQueue = async (): Promise<void> => {
  console.log('Database not available on web platform');
};
