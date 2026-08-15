import { EHttpStatusCode } from "@/types/enum";
import {
  IBaseResponseData,
  IPagination,
  IResponseWithPaginate,
} from "@/types/globalType";

type TSuccessOptions = {
  statusCode?: EHttpStatusCode;
  message?: string;
};

export const apiSuccess = <T>(data: T, options: TSuccessOptions = {}) => {
  const statusCode = options.statusCode ?? EHttpStatusCode.SUCCESS;
  const body: IBaseResponseData<T> = {
    statusCode,
    message: options.message ?? "Success",
    data,
  };

  return Response.json(body, { status: statusCode });
};

export const apiSuccessWithPaginate = <T>(
  data: T,
  meta: IPagination,
  options: TSuccessOptions = {}
) => {
  const statusCode = options.statusCode ?? EHttpStatusCode.SUCCESS;
  const body: IResponseWithPaginate<T> = {
    statusCode,
    message: options.message ?? "Success",
    data,
    meta,
  };

  return Response.json(body, { status: statusCode });
};

export const apiError = (statusCode: EHttpStatusCode, message: string) => {
  const body: IBaseResponseData<null> = {
    statusCode,
    message,
    data: null,
  };

  return Response.json(body, { status: statusCode });
};
