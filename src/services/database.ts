import * as SQLite from 'expo-sqlite';
import { QueuedJob } from '../types';

const db = SQLite.openDatabaseSync('field_inspector.db');

export const initializeDatabase = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS queued_jobs (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      retry_count INTEGER DEFAULT 0,
      error TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const addJobToQueue = async (job: QueuedJob): Promise<void> => {
  const statement = await db.prepareAsync(
    'INSERT INTO queued_jobs (id, data, retry_count, error) VALUES (?, ?, ?, ?)'
  );
  try {
    await statement.executeAsync([
      job.id,
      JSON.stringify(job),
      job.retryCount,
      job.error || null,
    ]);
  } finally {
    await statement.finalizeAsync();
  }
};

export const getQueuedJobs = async (): Promise<QueuedJob[]> => {
  const result = await db.getAllAsync<{ id: string; data: string; retry_count: number; error: string | null }>(
    'SELECT * FROM queued_jobs ORDER BY created_at DESC'
  );
  return result.map((row) => ({
    ...JSON.parse(row.data),
    retryCount: row.retry_count,
    error: row.error || undefined,
  }));
};

export const removeJobFromQueue = async (jobId: string): Promise<void> => {
  const statement = await db.prepareAsync('DELETE FROM queued_jobs WHERE id = ?');
  try {
    await statement.executeAsync([jobId]);
  } finally {
    await statement.finalizeAsync();
  }
};

export const updateQueuedJobRetry = async (jobId: string, retryCount: number, error?: string): Promise<void> => {
  const statement = await db.prepareAsync(
    'UPDATE queued_jobs SET retry_count = ?, error = ? WHERE id = ?'
  );
  try {
    await statement.executeAsync([retryCount, error || null, jobId]);
  } finally {
    await statement.finalizeAsync();
  }
};

export const clearQueue = async (): Promise<void> => {
  await db.execAsync('DELETE FROM queued_jobs');
};
