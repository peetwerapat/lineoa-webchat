import { create } from "zustand";

type ChatStore = {
  activeCustomerId: string | null;
  drafts: Record<string, string>;
  isSidebarOpen: boolean;

  setActiveCustomer: (customerId: string | null) => void;
  setDraft: (customerId: string, content: string) => void;
  clearDraft: (customerId: string) => void;
  toggleSidebar: (open?: boolean) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  activeCustomerId: null,
  drafts: {},
  isSidebarOpen: true,

  setActiveCustomer: (activeCustomerId) => set({ activeCustomerId }),
  setDraft: (customerId, content) =>
    set((state) => ({
      drafts: { ...state.drafts, [customerId]: content },
    })),
  clearDraft: (customerId) =>
    set((state) => {
      const drafts = { ...state.drafts };
      delete drafts[customerId];

      return { drafts };
    }),
  toggleSidebar: (open) =>
    set((state) => ({ isSidebarOpen: open ?? !state.isSidebarOpen })),
}));
