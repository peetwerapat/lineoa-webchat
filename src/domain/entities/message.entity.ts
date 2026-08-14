import { EMessageDirection, EMessageType } from "@/types/enum";

export type TMessageEntity = {
  id: string;
  customerId: string;
  lineMessageId: string | null;
  direction: EMessageDirection;
  messageType: EMessageType;
  content: string;
  sentBy: string | null;
  createdAt: Date;
};
