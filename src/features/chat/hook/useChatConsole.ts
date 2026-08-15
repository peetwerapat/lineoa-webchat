import { useEffect } from "react";

import { useChatStream } from "@/features/chat/hook/useChatStream";
import { useFetchCustomers } from "@/features/chat/hook/useFetchCustomers";
import { useFetchMessages } from "@/features/chat/hook/useFetchMessages";
import { useMarkCustomerRead } from "@/features/chat/hook/useMarkCustomerRead";
import { useSendMessage } from "@/features/chat/hook/useSendMessage";
import { useChatStore } from "@/features/chat/store/chatStore";

export const useChatConsole = () => {
  useChatStream();

  const activeCustomerId = useChatStore((state) => state.activeCustomerId);
  const drafts = useChatStore((state) => state.drafts);
  const setActiveCustomer = useChatStore((state) => state.setActiveCustomer);
  const setDraft = useChatStore((state) => state.setDraft);
  const clearDraft = useChatStore((state) => state.clearDraft);

  const { customers, isLoading: isLoadingCustomers } = useFetchCustomers();
  const {
    messages,
    isLoading: isLoadingMessages,
    hasMore,
    isLoadingMore,
    loadMore,
  } = useFetchMessages(activeCustomerId);
  const { sendMessage, isPending: isSending } = useSendMessage(
    activeCustomerId ?? ""
  );
  const { markRead } = useMarkCustomerRead(activeCustomerId ?? "");

  const activeCustomer =
    customers.find((customer) => customer.id === activeCustomerId) ?? null;
  const draft = activeCustomerId ? (drafts[activeCustomerId] ?? "") : "";
  const activeUnreadCount = activeCustomer?.unreadCount ?? 0;

  useEffect(() => {
    if (!activeCustomerId || activeUnreadCount === 0) return;

    markRead();
  }, [activeCustomerId, activeUnreadCount, markRead]);

  const handleChangeDraft = (value: string) => {
    if (!activeCustomerId) return;

    setDraft(activeCustomerId, value);
  };

  const handleSendMessage = () => {
    const content = draft.trim();
    if (!activeCustomerId || !content) return;

    sendMessage({ content }, { onSuccess: () => clearDraft(activeCustomerId) });
  };

  return {
    customers,
    isLoadingCustomers,
    activeCustomer,
    activeCustomerId,
    messages,
    isLoadingMessages,
    hasMore,
    isLoadingMore,
    loadMore,
    draft,
    isSending,
    handleSelectCustomer: setActiveCustomer,
    handleChangeDraft,
    handleSendMessage,
  };
};
