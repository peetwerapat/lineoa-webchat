import { EMessageDirection, EMessageStatus, EMessageType } from "@/types/enum";

export type TMessageEntity = {
  id: string;
  customerId: string;
  clientId: string | null;
  direction: EMessageDirection;
  messageType: EMessageType;
  status: EMessageStatus;
  content: string;
  payload: unknown;
  sentBy: string | null;
  createdAt: Date;
};
