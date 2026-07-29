import { JobPriority, JobStatus } from '../../core/models/job.model';

export type BadgeTone = 'neutral' | 'steel' | 'success' | 'danger' | 'brand';

interface StatusMeta {
  label: string;
  tone: BadgeTone;
}

// Received = queued (neutral) -> InProgress = active work (steel) -> Completed = done well
// (success green) -> Delivered = closed out (solid neutral). Same hue family throughout except
// the one moment (Completed) that's worth calling out in green.
export const STATUS_META: Record<JobStatus, StatusMeta> = {
  Received: { label: 'Received', tone: 'neutral' },
  InProgress: { label: 'In Progress', tone: 'steel' },
  Completed: { label: 'Completed', tone: 'success' },
  Delivered: { label: 'Delivered', tone: 'neutral' },
};

// High = danger red -> Medium = brand orange -> Low = neutral.
export const PRIORITY_META: Record<JobPriority, StatusMeta> = {
  High: { label: 'High', tone: 'danger' },
  Medium: { label: 'Medium', tone: 'brand' },
  Low: { label: 'Low', tone: 'neutral' },
};
