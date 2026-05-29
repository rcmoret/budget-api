import { create } from "zustand";

type NotificationKind = "alert" | "info" | "notice" | "warning";

type Notification = {
  id: string;
  kind: NotificationKind;
  message: string;
};

type DispatchInput = {
  kind: NotificationKind;
  message: string;
};

type DispatchNotificationState = {
  items: Array<Notification>;
  closingIds: ReadonlySet<string>;

  useDispatchNotification: (input: DispatchInput) => string;
  beginClose: (id: string) => void;
  finishClose: (id: string) => void;
  resetItems: (items: Array<Notification>) => void;
};

const DISMISS_AFTER_MS = 3000;
const CLOSE_ANIMATION_MS = 1000;

const generateId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `n-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const useDispatchNotificationStore = create<DispatchNotificationState>(
  (set, get) => ({
    items: [],
    closingIds: new Set<string>(),

    useDispatchNotification: ({ kind, message }) => {
      const id = generateId();
      set((s) => ({ items: [...s.items, { id, kind, message }] }));

      setTimeout(() => get().beginClose(id), DISMISS_AFTER_MS);

      return id;
    },

    beginClose: (id) => {
      const state = get();
      if (state.closingIds.has(id)) return;
      if (!state.items.some((i) => i.id === id)) return;

      const closingIds = new Set(state.closingIds);
      closingIds.add(id);
      set({ closingIds });

      setTimeout(() => get().finishClose(id), CLOSE_ANIMATION_MS);
    },

    finishClose: (id) => {
      set((s) => {
        const items = s.items.filter((i) => i.id !== id);
        if (!s.closingIds.has(id)) return { items };
        const closingIds = new Set(s.closingIds);
        closingIds.delete(id);
        return { items, closingIds };
      });
    },

    resetItems: (newItems) => {
      set({ items: newItems, closingIds: new Set() });
      newItems.forEach((item) => {
        setTimeout(() => get().beginClose(item.id), DISMISS_AFTER_MS);
      });
    },
  }),
);

export {
  useDispatchNotificationStore,
  CLOSE_ANIMATION_MS,
  DISMISS_AFTER_MS,
  type Notification,
  type NotificationKind,
  type DispatchInput,
};
