import { useMemo } from "react";

import { chatKeys } from "@/features/chat/util/chatKeys";
import { useInfiniteQueryGet } from "@/services/globalQuery";
import { TMessage } from "@/types/chat/chatType";

export const MESSAGE_PAGE_SIZE = 30;

export const useFetchMessages = (customerId: string | null) => {
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQueryGet<TMessage>(
    chatKeys.messages(customerId ?? ""),
    `/api/customers/${customerId}/messages`,
    { limit: MESSAGE_PAGE_SIZE },
    { enabled: Boolean(customerId) }
  );

  const messages = useMemo(
    () => [...(data?.pages ?? [])].reverse().flatMap((page) => page.data),
    [data]
  );

  return {
    messages,
    isLoading,
    isError,
    hasMore: hasNextPage,
    isLoadingMore: isFetchingNextPage,
    loadMore: fetchNextPage,
  };
};
