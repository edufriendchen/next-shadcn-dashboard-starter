import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
import type { NotificationStatus, NotificationAction } from '@/components/ui/notification-card';
import { listNotifications, readNotification, readAllNotifications } from '../api/service';

export type Notification = {
  id: string;
  title: string;
  body: string;
  status: NotificationStatus;
  createdAt: string;
  // Backend "前端跳转地址" — where this notification links to.
  url?: string;
  actions?: NotificationAction[];
};

type NotificationState = {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'status'>) => void;
  unreadCount: () => number;
};

export const useNotificationStore = create<NotificationState>()(
  // To enable persistence across refreshes, uncomment the persist wrapper below:
  // persist(
  (set, get) => {
    // Load the real notifications from the backend (ListNotifications) on the
    // client. Runs once when the store is first created.
    if (typeof window !== 'undefined') {
      listNotifications()
        .then((notifications) => set({ notifications }))
        .catch(() => {
          /* leave the list empty if the request fails */
        });
    }

    return {
      notifications: [],

      markAsRead: (id) => {
        // Optimistic update, then persist to the backend (ReadNotification).
        const prev = get().notifications;
        set({
          notifications: prev.map((n) => (n.id === id ? { ...n, status: 'read' as const } : n))
        });
        readNotification(id).catch(() => set({ notifications: prev }));
      },

      markAllAsRead: () => {
        // Optimistic update, then persist to the backend (ReadAllNotifications).
        const prev = get().notifications;
        set({
          notifications: prev.map((n) => ({
            ...n,
            status: 'read' as const
          }))
        });
        readAllNotifications().catch(() => set({ notifications: prev }));
      },

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id)
        })),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [{ ...notification, status: 'unread' as const }, ...state.notifications]
        })),

      unreadCount: () => get().notifications.filter((n) => n.status === 'unread').length
    };
  }
  //   ,
  //   { name: 'notifications' }
  // )
);
