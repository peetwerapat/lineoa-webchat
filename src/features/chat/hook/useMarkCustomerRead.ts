import { useQueryClient } from "@tanstack/react-query";

import { upsertCustomer } from "@/features/chat/util/chatCache";
import { useMutationPatch } from "@/services/globalQuery";
import { TCustomer } from "@/types/chat/chatType";
import { IBaseResponseData } from "@/types/globalType";

export const useMarkCustomerRead = (customerId: string) => {
  const queryClient = useQueryClient();

  const { mutate: markRead } = useMutationPatch<
    IBaseResponseData<TCustomer>,
    void
  >(`/api/customers/${customerId}/read`, {
    onSuccess: ({ data }) => {
      upsertCustomer(queryClient, data);
    },
  });

  return {
    markRead,
  };
};
