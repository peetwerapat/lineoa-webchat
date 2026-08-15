import { chatKeys } from "@/features/chat/util/chatKeys";
import { useQueryGet } from "@/services/globalQuery";
import { TCustomer } from "@/types/chat/chatType";
import { IBaseResponseData } from "@/types/globalType";

export const useFetchCustomers = () => {
  const { data, isLoading, isError } = useQueryGet<
    IBaseResponseData<TCustomer[]>
  >(chatKeys.customers, "/api/customers");

  return {
    customers: data?.data ?? [],
    isLoading,
    isError,
  };
};
