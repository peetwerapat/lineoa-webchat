export interface IMeta {
  page: number;
  limit: number;
  totalPages?: number;
  total?: number;
}

export interface IOption {
  value: string;
  label: string;
  extra?: string;
}

export interface IBaseResponseData<T> {
  data: T;
}

export interface IPagination {
  totalCount: number;
  totalPages: number;
}

export interface IBaseResponseDataWithPaginate<T> extends IPagination {
  data: T;
}
