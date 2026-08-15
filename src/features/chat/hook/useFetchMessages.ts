import { useMemo } from "react";

import { DEFAULT_MESSAGE_LIMIT } from "@/constants/chat";
import { chatKeys } from "@/features/chat/util/chatKeys";
import { useInfiniteQueryGet } from "@/services/globalQuery";
import { TMessage } from "@/types/chat/chatType";

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
    { limit: DEFAULT_MESSAGE_LIMIT },
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
