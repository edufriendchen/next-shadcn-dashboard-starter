// common.Status codes surfaced in the UI. Values mirror the backend enum —
// align them with common.proto if it differs.
export const STATUS_OPTIONS = [
  { value: '1', label: 'Active' },
  { value: '2', label: 'Inactive' }
];

export const STATUS_LABELS: Record<number, string> = {
  0: 'Unspecified',
  1: 'Active',
  2: 'Inactive'
};

export function statusLabel(status: number): string {
  return STATUS_LABELS[status] ?? `Status ${status}`;
}
