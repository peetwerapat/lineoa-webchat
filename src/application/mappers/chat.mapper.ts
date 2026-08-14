import { TCustomerEntity } from "@/domain/entities/customer.entity";
import { TMessageEntity } from "@/domain/entities/message.entity";
import { TCustomer, TMessage } from "@/types/chat/chatType";

export const toMessageDto = (message: TMessageEntity): TMessage => ({
  id: message.id,
  customerId: message.customerId,
  direction: message.direction,
  messageType: message.messageType,
  content: message.content,
  sentBy: message.sentBy,
  createdAt: message.createdAt.toISOString(),
});

export const toCustomerDto = (
  customer: TCustomerEntity,
  lastMessage: TMessageEntity | null
): TCustomer => ({
  id: customer.id,
  lineUserId: customer.lineUserId,
  displayName: customer.displayName,
  pictureUrl: customer.pictureUrl,
  lastMessage: lastMessage ? toMessageDto(lastMessage) : null,
});
