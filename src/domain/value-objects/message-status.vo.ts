import { EMessageStatus } from "@/types/enum";

export const parseMessageStatus = (value: string): EMessageStatus => {
  const status = value.toUpperCase() as EMessageStatus;

  return Object.values(EMessageStatus).includes(status)
    ? status
    : EMessageStatus.SENT;
};
