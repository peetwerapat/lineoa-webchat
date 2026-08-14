import "server-only";

import { TMessageEntity } from "@/domain/entities/message.entity";
import {
  IMessageRepository,
  TCreateMessageInput,
} from "@/domain/repositories/message.repository";
import { parseMessageDirection } from "@/domain/value-objects/message-direction.vo";
import { parseMessageType } from "@/domain/value-objects/message-type.vo";
import { prisma } from "@/infrastructure/prisma/prisma.client";
import { MessageModel } from "@/lib/generated/prisma/models";

export const toMessageEntity = (message: MessageModel): TMessageEntity => ({
  id: message.id,
  customerId: message.customerId,
  lineMessageId: message.lineMessageId,
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
    });

    return toMessageEntity(message);
  }

  async listByCustomer(customerId: string, take: number) {
    const messages = await prisma.message.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
      take,
    });

    return messages.map(toMessageEntity);
  }
}
