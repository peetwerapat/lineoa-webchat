import { useQueryClient } from "@tanstack/react-query";

import {
  patchLastMessage,
  upsertMessage,
} from "@/features/chat/util/chatCache";
import { useMutationPost } from "@/services/globalQuery";
import { TMessage, TSendMessageRequest } from "@/types/chat/chatType";
import { EMessageDirection, EMessageStatus, EMessageType } from "@/types/enum";
import { IBaseResponseData } from "@/types/globalType";

const buildOptimisticMessage = (
  customerId: string,
  clientId: string,
  content: string,
  sentBy?: string
): TMessage => ({
  id: clientId,
  customerId,
  clientId,
  direction: EMessageDirection.OUTBOUND,
  messageType: EMessageType.TEXT,
  status: EMessageStatus.PENDING,
  content,
  sticker: null,
  sentBy: sentBy ?? null,
  createdAt: new Date().toISOString(),
});

export const useSendMessage = (customerId: string) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutationPost<
    IBaseResponseData<TMessage>,
    TSendMessageRequest
  >(`/api/customers/${customerId}/messages`);

  const push = (optimistic: TMessage) => {
    upsertMessage(queryClient, customerId, optimistic);
    patchLastMessage(queryClient, customerId, optimistic);

    mutate(
      {
        content: optimistic.content,
        clientId: optimistic.clientId ?? optimistic.id,
        sentBy: optimistic.sentBy ?? undefined,
      },
      {
        onSuccess: ({ data }) => {
          upsertMessage(queryClient, customerId, data);
          patchLastMessage(queryClient, customerId, data);
        },
        onError: () => {
          const failed = { ...optimistic, status: EMessageStatus.FAILED };

          upsertMessage(queryClient, customerId, failed);
          patchLastMessage(queryClient, customerId, failed);
        },
      }
    );
  };

  const sendMessage = (content: string, sentBy?: string) =>
    push(
      buildOptimisticMessage(customerId, crypto.randomUUID(), content, sentBy)
    );

  // Retries reuse the original clientId, so the server recognises the message
  // instead of pushing a second copy to the customer.
  const retryMessage = (message: TMessage) =>
    push({ ...message, status: EMessageStatus.PENDING });

  return {
    sendMessage,
    retryMessage,
    isPending,
  };
};
