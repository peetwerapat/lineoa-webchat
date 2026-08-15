import "server-only";

import { TMessageEntity } from "@/domain/entities/message.entity";
import {
  IMessageRepository,
  TCreateMessageInput,
  TListMessagesParams,
} from "@/domain/repositories/message.repository";
import { parseMessageDirection } from "@/domain/value-objects/message-direction.vo";
import { parseMessageType } from "@/domain/value-objects/message-type.vo";
import { prisma } from "@/infrastructure/prisma/prisma.client";
import { MessageGetPayload } from "@/lib/generated/prisma/models";

export const messageSelect = {
  id: true,
  customerId: true,
  direction: true,
  messageType: true,
  content: true,
  sentBy: true,
  createdAt: true,
} as const;

type TMessageRow = MessageGetPayload<{ select: typeof messageSelect }>;

export const toMessageEntity = (message: TMessageRow): TMessageEntity => ({
  id: message.id,
  customerId: message.customerId,
  direction: parseMessageDirection(message.direction),
  messageType: parseMessageType(message.messageType),
  content: message.content,
  sentBy: message.sentBy,
  createdAt: message.createdAt,
});

export class MessagePrismaRepository implements IMessageRepository {
  async findByLineMessageId(lineMessageId: string) {
    const message = await prisma.message.findUnique({
      where: { lineMessageId },
      select: messageSelect,
    });

    return message ? toMessageEntity(message) : null;
  }

  async create(input: TCreateMessageInput) {
    const message = await prisma.message.create({
      data: {
        customerId: input.customerId,
        lineMessageId: input.lineMessageId ?? null,
        direction: input.direction,
        messageType: input.messageType,
        content: input.content,
        payload: (input.payload ?? undefined) as object | undefined,
        sentBy: input.sentBy ?? null,
      },
      select: messageSelect,
    });

    return toMessageEntity(message);
  }

  async listByCustomer({ customerId, page, limit }: TListMessagesParams) {
    const messages = await prisma.message.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: messageSelect,
    });

    return messages.map(toMessageEntity);
  }

  async countByCustomer(customerId: string) {
    return prisma.message.count({ where: { customerId } });
  }

  async findLatestByCustomer(customerId: string) {
    const message = await prisma.message.findFirst({
      where: { customerId },
      orderBy: { createdAt: "desc" },
      select: messageSelect,
    });

    return message ? toMessageEntity(message) : null;
  }
}
