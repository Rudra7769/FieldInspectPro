import * as SQLite from 'expo-sqlite';
import { QueuedJob, Job } from '../types';

let db: any = null;

export const initializeDatabase = async () => {
  try {
    db = SQLite.openDatabaseSync('field_inspector.db');
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        synced INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS queued_jobs (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        retry_count INTEGER DEFAULT 0,
        error TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

export const saveJob = async (job: Job): Promise<void> => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  try {
    const statement = await db.prepareAsync(
      'INSERT OR REPLACE INTO jobs (id, data, synced) VALUES (?, ?, ?)'
    );
    try {
      await statement.executeAsync([
        job.id,
        JSON.stringify(job),
        job.synced ? 1 : 0,
      ]);
      console.log(`Job ${job.id} saved successfully`);
    } finally {
      await statement.finalizeAsync();
    }
  } catch (error) {
    console.error('Failed to save job:', error);
    throw error;
  }
};

export const getAllJobs = async (): Promise<Job[]> => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  try {
    const result = await db.getAllAsync<{ id: string; data: string; synced: number }>(
      'SELECT * FROM jobs ORDER BY created_at DESC'
    );
    return result.map((row) => ({
      ...JSON.parse(row.data),
      synced: row.synced === 1,
    }));
  } catch (error) {
    console.error('Failed to get jobs:', error);
    throw error;
  }
};

export const updateJobSyncStatus = async (jobId: string, synced: boolean): Promise<void> => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  try {
    const statement = await db.prepareAsync(
      'UPDATE jobs SET synced = ? WHERE id = ?'
    );
    try {
      await statement.executeAsync([synced ? 1 : 0, jobId]);
    } finally {
      await statement.finalizeAsync();
    }
  } catch (error) {
    console.error('Failed to update job sync status:', error);
    throw error;
  }
};

export const deleteJob = async (jobId: string): Promise<void> => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  try {
    const statement = await db.prepareAsync('DELETE FROM jobs WHERE id = ?');
    try {
      await statement.executeAsync([jobId]);
    } finally {
      await statement.finalizeAsync();
    }
  } catch (error) {
    console.error('Failed to delete job:', error);
    throw error;
  }
};

export const addJobToQueue = async (job: QueuedJob): Promise<void> => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  try {
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
      console.log(`Queued job ${job.id} added successfully`);
    } finally {
      await statement.finalizeAsync();
    }
  } catch (error) {
    console.error('Failed to add job to queue:', error);
    throw error;
  }
};

export const getQueuedJobs = async (): Promise<QueuedJob[]> => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  try {
    const result = await db.getAllAsync<{ id: string; data: string; retry_count: number; error: string | null }>(
      'SELECT * FROM queued_jobs ORDER BY created_at DESC'
    );
    return result.map((row) => ({
      ...JSON.parse(row.data),
      retryCount: row.retry_count,
      error: row.error || undefined,
    }));
  } catch (error) {
    console.error('Failed to get queued jobs:', error);
    throw error;
  }
};

export const removeJobFromQueue = async (jobId: string): Promise<void> => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  try {
    const statement = await db.prepareAsync('DELETE FROM queued_jobs WHERE id = ?');
    try {
      await statement.executeAsync([jobId]);
      console.log(`Queued job ${jobId} removed successfully`);
    } finally {
      await statement.finalizeAsync();
    }
  } catch (error) {
    console.error('Failed to remove queued job:', error);
    throw error;
  }
};

export const updateQueuedJobRetry = async (jobId: string, retryCount: number, error?: string): Promise<void> => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  try {
    const statement = await db.prepareAsync(
      'UPDATE queued_jobs SET retry_count = ?, error = ? WHERE id = ?'
    );
    try {
      await statement.executeAsync([retryCount, error || null, jobId]);
    } finally {
      await statement.finalizeAsync();
    }
  } catch (error) {
    console.error('Failed to update queued job retry:', error);
    throw error;
  }
};

export const clearQueue = async (): Promise<void> => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  try {
    await db.execAsync('DELETE FROM queued_jobs');
  } catch (error) {
    console.error('Failed to clear queue:', error);
    throw error;
  }
};
