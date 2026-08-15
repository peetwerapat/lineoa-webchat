import { TCustomerEntity } from "@/domain/entities/customer.entity";
import { TMessageEntity } from "@/domain/entities/message.entity";
import { parseSticker } from "@/domain/value-objects/sticker.vo";
import { TCustomer, TMessage } from "@/types/chat/chatType";
import { EMessageType } from "@/types/enum";

export const toMessageDto = (message: TMessageEntity): TMessage => ({
  id: message.id,
  customerId: message.customerId,
  direction: message.direction,
  messageType: message.messageType,
  content: message.content,
  sticker:
    message.messageType === EMessageType.STICKER
      ? parseSticker(message.payload)
      : null,
  sentBy: message.sentBy,
  createdAt: message.createdAt.toISOString(),
});

export const toCustomerDto = (
  customer: TCustomerEntity,
  lastMessage: TMessageEntity | null
): TCustomer => ({
  id: customer.id,
  displayName: customer.displayName,
  pictureUrl: customer.pictureUrl,
  unreadCount: customer.unreadCount,
  lastMessage: lastMessage ? toMessageDto(lastMessage) : null,
});
