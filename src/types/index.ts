export interface User {
  id: string;
  name: string;
  email: string;
  engineerId: string;
  assignedRegion?: string;
}

export interface Assignment {
  id: string;
  societyName: string;
  flatNumbers: string[];
  address: string;
  urgency: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
}

export interface ChecklistItem {
  id: string;
  category: string;
  label: string;
  checked: boolean;
}

export type JobStatus = 'Done' | 'Client Not Available' | 'Refused' | 'Follow-up Needed';

export interface Job {
  id: string;
  assignmentId: string;
  societyName: string;
  flatNumber: string;
  address: string;
  checklist: ChecklistItem[];
  status: JobStatus;
  notes: string;
  photos: string[];
  signature: string;
  gpsCoordinates: {
    latitude: number;
    longitude: number;
  };
  timestamp: string;
  synced: boolean;
}

export interface QueuedJob extends Job {
  retryCount: number;
  error?: string;
}
