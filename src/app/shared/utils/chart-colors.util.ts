import { JobStatus } from '../../core/models/job.model';

// Reuses the same solid hex shades as the `.badge--*` text colors in styles.scss, so chart
// segments read as the same color language as the status/priority badges elsewhere in the app —
// not a separate palette invented for charts alone.
export const STATUS_CHART_COLOR: Record<JobStatus, string> = {
  Received: '#3a3f47',
  InProgress: '#1f4a72',
  Completed: '#1e6b39',
  Delivered: '#667884',
};

// Cycled by index across however many departments a tenant has — departments have no fixed
// identity/color of their own, so this is just a distinct rotation of the existing badge palette.
export const DEPARTMENT_CHART_COLORS = ['#1f4a72', '#a35300', '#1e6b39', '#a3231f', '#667884', '#3a3f47'];

// Named single colors for report charts that aren't keyed by job status (revenue, unpaid
// amounts, mechanic productivity buckets) — same hex family as STATUS_CHART_COLOR/badges, plus
// one darker neutral (slateDark) for a "closed out" bucket distinct from the mid-tone slate above.
export const CHART_COLOR = {
  brand: '#a35300',
  success: '#1e6b39',
  danger: '#a3231f',
  steel: '#1f4a72',
  slate: '#667884',
  slateDark: '#444e55',
};
