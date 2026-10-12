// ============================================================
// Notifications Service — Data Access Layer
// ============================================================
// BFF: calls the Next.js route handler at /api/notifications, which
// proxies to `${BACKEND_URL}/api/v1/admin/notifications` (ListNotifications).
// Maps the backend Notification shape to the store's Notification shape.
// ============================================================

import { apiClient } from '@/lib/api-client';
import type { NotificationStatus } from '@/components/ui/notification-card';
import type { Notification } from '../utils/store';

// Raw shape returned by the Go backend (notification.proto).
type BackendNotification = {
  id: number;
  user_id: number;
  type: number;
  level: number;
  title: string;
  content: string;
  url: string;
  status: number; // NotificationStatus enum: 1 = unread, 2 = read
  data: string;
  created_at: number;
  read_at: number;
};

type ListNotificationsResponse = {
  code: number;
  message: string;
  notifications: BackendNotification[];
  total: number;
  unread_count: number;
};

function toStatus(status: number): NotificationStatus {
  // 2 = NOTIFICATION_STATUS_READ, everything else treated as unread
  return status === 2 ? 'read' : 'unread';
}

function toISO(ts: number): string {
  if (!ts) return new Date().toISOString();
  // Backend sends unix time; treat values below 1e12 as seconds.
  const ms = ts < 1e12 ? ts * 1000 : ts;
  return new Date(ms).toISOString();
}

export async function listNotifications(params?: {
  page?: number;
  page_size?: number;
}): Promise<Notification[]> {
  const qs = new URLSearchParams();
  qs.set('page', String(params?.page ?? 1));
  qs.set('page_size', String(params?.page_size ?? 20));

  const res = await apiClient<ListNotificationsResponse>(`/notifications?${qs.toString()}`);

  return (res.notifications ?? []).map((n) => ({
    id: String(n.id),
    title: n.title,
    body: n.content,
    status: toStatus(n.status),
    createdAt: toISO(n.created_at),
    // Preserve the backend link so the card can navigate to it.
    url: n.url || undefined,
    actions: n.url
      ? [
          {
            id: 'open-link',
            label: 'View',
            type: 'redirect' as const,
            style: 'primary' as const
          }
        ]
      : undefined
  }));
}

type AckResponse = {
  code: number;
  message: string;
};

// Mark a single notification as read — ReadNotification
// POST /api/v1/admin/notifications/:id/read
export async function readNotification(id: string): Promise<void> {
  await apiClient<AckResponse>(`/notifications/${id}/read`, { method: 'POST' });
}

// Mark all notifications as read — ReadAllNotifications
// POST /api/v1/admin/notifications/read-all
export async function readAllNotifications(): Promise<void> {
  await apiClient<AckResponse & { affected_count: number }>('/notifications/read-all', {
    method: 'POST'
  });
}
