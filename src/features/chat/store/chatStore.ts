import { create } from "zustand";

type ChatStore = {
  activeCustomerId: string | null;
  drafts: Record<string, string>;

  setActiveCustomer: (customerId: string | null) => void;
  setDraft: (customerId: string, content: string) => void;
  clearDraft: (customerId: string) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  activeCustomerId: null,
  drafts: {},

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
}));
