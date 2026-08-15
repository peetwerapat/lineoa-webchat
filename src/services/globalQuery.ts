import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";

import { apiDelete, apiGet, apiPatch, apiPost } from "@/services/common";
import { IResponseWithPaginate } from "@/types/globalType";

type QueryGetOptions<TRes> = Omit<
  UseQueryOptions<TRes, unknown, TRes, QueryKey>,
  "queryKey" | "queryFn"
>;

type TPaginatedResponse<TItem> = IResponseWithPaginate<TItem[]>;

type InfiniteQueryGetOptions<TItem> = Omit<
  UseInfiniteQueryOptions<
    TPaginatedResponse<TItem>,
    unknown,
    InfiniteData<TPaginatedResponse<TItem>>,
    QueryKey,
    number
  >,
  "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
>;

export function useQueryGet<TRes>(
  key: QueryKey,
  path: string,
  query?: Record<string, any>,
  options?: QueryGetOptions<TRes>
) {
  return useQuery<TRes, unknown, TRes, QueryKey>({
    queryKey: key,
    queryFn: () => apiGet<TRes>(path, query),
    ...options,
  });
}

export function useInfiniteQueryGet<TItem>(
  key: QueryKey,
  path: string,
  query?: Record<string, any>,
  options?: InfiniteQueryGetOptions<TItem>
) {
  return useInfiniteQuery({
    queryKey: key,
    queryFn: ({ pageParam }) =>
      apiGet<TPaginatedResponse<TItem>>(path, { ...query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: TPaginatedResponse<TItem>) => {
      const { page, totalPages } = lastPage.meta;

      return totalPages && page < totalPages ? page + 1 : undefined;
    },
    ...options,
  });
}

export function useMutationPost<TRes, TReq = any>(
  path: string,
  options?: UseMutationOptions<TRes, unknown, TReq>
) {
  return useMutation<TRes, unknown, TReq>({
    mutationFn: (payload: TReq) => apiPost<TRes, TReq>(path, payload),
    ...options,
  });
}

export function useMutationPatch<TRes, TReq = any>(
  path: string,
  options?: UseMutationOptions<TRes, unknown, TReq>
) {
  return useMutation<TRes, unknown, TReq>({
    mutationFn: (payload: TReq) => apiPatch<TRes, TReq>(path, payload),
    ...options,
  });
}

export function useMutationDelete<TRes>(
  path: string,
  options?: UseMutationOptions<TRes, unknown, void>
) {
  return useMutation<TRes, unknown, void>({
    mutationFn: () => apiDelete<TRes>(path),
    ...options,
  });
}
