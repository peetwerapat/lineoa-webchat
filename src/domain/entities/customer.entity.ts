import { TMessageEntity } from "@/domain/entities/message.entity";

export type TCustomerEntity = {
  id: string;
  lineUserId: string;
  displayName: string | null;
  pictureUrl: string | null;
  unreadCount: number;
  lastReadAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TCustomerWithLastMessage = TCustomerEntity & {
  lastMessage: TMessageEntity | null;
};
