import { EMessageDirection, EMessageStatus, EMessageType } from "@/types/enum";

export type TSticker = {
  packageId: string | null;
  stickerId: string;
  resourceType: string;
  imageUrl: string;
  fallbackImageUrl: string;
};

export type TMessage = {
  id: string;
  customerId: string;
  clientId: string | null;
  direction: EMessageDirection;
  messageType: EMessageType;
  status: EMessageStatus;
  content: string;
  sticker: TSticker | null;
  sentBy: string | null;
  createdAt: string;
};

export type TCustomer = {
  id: string;
  displayName: string | null;
  pictureUrl: string | null;
  unreadCount: number;
  lastMessage: TMessage | null;
};

export type TSendMessageRequest = {
  content: string;
  clientId: string;
  sentBy?: string;
};

export type TChatEvent =
  | {
      type: "message.created";
      customerId: string;
      message: TMessage;
    }
  | {
      type: "customer.updated";
      customerId: string;
      customer: TCustomer;
    };
