export interface IPagination {
  page: number;
  limit: number;
  totalPages?: number;
  totalCount?: number;
}

export interface IOption {
  value: string;
  label: string;
  extra?: string;
}

export interface IBaseResponse {
  statusCode: number;
  message: string;
}

export interface IBaseResponseData<T> extends IBaseResponse {
  data: T;
}

export interface IResponseWithPaginate<T> extends IBaseResponse {
  data: T;
  meta: IPagination;
}
