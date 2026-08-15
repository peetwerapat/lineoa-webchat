"use client";

import { CustomerList } from "@/features/chat/components/CustomerList";
import { EmptyThread } from "@/features/chat/components/EmptyThread";
import { MessageComposer } from "@/features/chat/components/MessageComposer";
import { MessageThread } from "@/features/chat/components/MessageThread";
import { useChatConsole } from "@/features/chat/hook/useChatConsole";

export const ChatConsole = () => {
  const {
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
    handleSelectCustomer,
    handleChangeDraft,
    handleSendMessage,
  } = useChatConsole();

  return (
    <div className="flex h-dvh w-full overflow-hidden">
      <CustomerList
        customers={customers}
        activeCustomerId={activeCustomerId}
        isLoading={isLoadingCustomers}
        onSelect={handleSelectCustomer}
      />

      <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {activeCustomer ? (
          <>
            <MessageThread
              customer={activeCustomer}
              messages={messages}
              isLoading={isLoadingMessages}
              hasMore={hasMore}
              isLoadingMore={isLoadingMore}
              onLoadMore={loadMore}
            />
            <MessageComposer
              value={draft}
              isSending={isSending}
              onChange={handleChangeDraft}
              onSubmit={handleSendMessage}
            />
          </>
        ) : (
          <EmptyThread />
        )}
      </section>
    </div>
  );
};
