import { create } from "zustand";
import type { JSONContent } from "@tiptap/react";
import { DiscretionaryDetails } from "@/types/budget/discretionary";
import { CreateEvent } from "@/lib/create-events-client";

type EditRow = {
  budgetItemKey: string;
  budgetCategoryKey: string;
  name: string;
  eventType: "item_adjust" | "item_create";
  createEvent?: CreateEvent;
};

type PreviewStatus = "idle" | "loading";

type EditStoreState = {
  rows: Array<EditRow>;
  notes: JSONContent | null;
  discretionaryAfter: DiscretionaryDetails | null;
  previewStatus: PreviewStatus;
  addRow: (row: EditRow) => void;
  removeRow: (budgetItemKey: string) => void;
  setNotes: (notes: JSONContent) => void;
  setDiscretionaryAfter: (discretionary: DiscretionaryDetails | null) => void;
  setPreviewStatus: (status: PreviewStatus) => void;
  reset: () => void;
};

const useEditStore = create<EditStoreState>((set, get) => ({
  rows: [],
  notes: null,
  discretionaryAfter: null,
  previewStatus: "idle",

  addRow: (row) => {
    if (get().rows.some((r) => r.budgetItemKey === row.budgetItemKey)) return;
    set({ rows: [...get().rows, row] });
  },
  removeRow: (budgetItemKey) =>
    set({ rows: get().rows.filter((r) => r.budgetItemKey !== budgetItemKey) }),
  setNotes: (notes) => set({ notes }),
  setDiscretionaryAfter: (discretionaryAfter) => set({ discretionaryAfter }),
  setPreviewStatus: (previewStatus) => set({ previewStatus }),
  reset: () =>
    set({
      rows: [],
      notes: null,
      discretionaryAfter: null,
      previewStatus: "idle",
    }),
}));

export { useEditStore, type EditRow };
