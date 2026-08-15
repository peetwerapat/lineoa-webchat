"use client";

import { CustomerList } from "@/features/chat/components/CustomerList";
import { EmptyThread } from "@/features/chat/components/EmptyThread";
import { MessageComposer } from "@/features/chat/components/MessageComposer";
import { MessageThread } from "@/features/chat/components/MessageThread";
import { useChatConsole } from "@/features/chat/hook/useChatConsole";
import { cn } from "@/lib/utils";

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
    handleSelectCustomer,
    handleCloseCustomer,
    handleChangeDraft,
    handleSendMessage,
    handleRetryMessage,
  } = useChatConsole();

  return (
    <div className="flex h-dvh w-full overflow-hidden">
      <CustomerList
        customers={customers}
        activeCustomerId={activeCustomerId}
        isLoading={isLoadingCustomers}
        className={cn(activeCustomer && "hidden md:flex")}
        onSelect={handleSelectCustomer}
      />

      <section
        className={cn(
          "min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
          activeCustomer ? "flex" : "hidden md:flex"
        )}
      >
        {activeCustomer ? (
          <>
            <MessageThread
              customer={activeCustomer}
              messages={messages}
              isLoading={isLoadingMessages}
              hasMore={hasMore}
              isLoadingMore={isLoadingMore}
              onLoadMore={loadMore}
              onBack={handleCloseCustomer}
              onRetryMessage={handleRetryMessage}
            />
            <MessageComposer
              value={draft}
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
