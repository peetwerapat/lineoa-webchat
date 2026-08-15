import { useQueryClient } from "@tanstack/react-query";

import {
  appendMessage,
  patchLastMessage,
} from "@/features/chat/util/chatCache";
import { useMutationPost } from "@/services/globalQuery";
import { TMessage, TSendMessageRequest } from "@/types/chat/chatType";
import { IBaseResponseData } from "@/types/globalType";

export const useSendMessage = (customerId: string) => {
  const queryClient = useQueryClient();

  const { mutate: sendMessage, isPending } = useMutationPost<
    IBaseResponseData<TMessage>,
    TSendMessageRequest
  >(`/api/customers/${customerId}/messages`, {
    onSuccess: ({ data }) => {
      appendMessage(queryClient, customerId, data);
      patchLastMessage(queryClient, customerId, data);
    },
  });

  return {
    sendMessage,
    isPending,
  };
};
