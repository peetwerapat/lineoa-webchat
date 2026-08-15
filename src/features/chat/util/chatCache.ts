import { InfiniteData, QueryClient } from "@tanstack/react-query";

import { chatKeys } from "@/features/chat/util/chatKeys";
import { TCustomer, TMessage } from "@/types/chat/chatType";
import { IBaseResponseData, IResponseWithPaginate } from "@/types/globalType";

const sortByLastMessage = (customers: TCustomer[]) =>
  [...customers].sort(
    (a, b) =>
      new Date(b.lastMessage?.createdAt ?? 0).getTime() -
      new Date(a.lastMessage?.createdAt ?? 0).getTime()
  );

export const upsertCustomer = (
  queryClient: QueryClient,
  customer: TCustomer
) => {
  queryClient.setQueryData<IBaseResponseData<TCustomer[]>>(
    chatKeys.customers,
    (current) => {
      if (!current) return current;

      const others = current.data.filter((item) => item.id !== customer.id);

      return { ...current, data: sortByLastMessage([customer, ...others]) };
    }
  );
};

export const patchLastMessage = (
  queryClient: QueryClient,
  customerId: string,
  message: TMessage
) => {
  queryClient.setQueryData<IBaseResponseData<TCustomer[]>>(
    chatKeys.customers,
    (current) => {
      if (!current) return current;

      const patched = current.data.map((customer) =>
        customer.id === customerId
          ? { ...customer, lastMessage: message }
          : customer
      );

      return { ...current, data: sortByLastMessage(patched) };
    }
  );
};

const isSameMessage = (a: TMessage, b: TMessage) =>
  a.id === b.id || (Boolean(a.clientId) && a.clientId === b.clientId);

/**
 * Inserts a message, or replaces it in place when the thread already holds it.
 * Matching on `clientId` as well as `id` is what lets the server's copy take
 * over the optimistic bubble — whichever of the POST response or the SSE echo
 * lands first.
 */
export const upsertMessage = (
  queryClient: QueryClient,
  customerId: string,
  message: TMessage
) => {
  queryClient.setQueryData<InfiniteData<IResponseWithPaginate<TMessage[]>>>(
    chatKeys.messages(customerId),
    (current) => {
      if (!current) return current;

      const isKnown = current.pages.some((page) =>
        page.data.some((item) => isSameMessage(item, message))
      );

      if (isKnown) {
        return {
          ...current,
          pages: current.pages.map((page) => ({
            ...page,
            data: page.data.map((item) =>
              isSameMessage(item, message) ? message : item
            ),
          })),
        };
      }

      const [newest, ...older] = current.pages;

      return {
        ...current,
        pages: [{ ...newest, data: [...newest.data, message] }, ...older],
      };
    }
  );
};
