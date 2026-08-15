import "server-only";

import { TMessageEntity } from "@/domain/entities/message.entity";
import {
  IMessageRepository,
  TCreateMessageInput,
  TListMessagesParams,
} from "@/domain/repositories/message.repository";
import { parseMessageDirection } from "@/domain/value-objects/message-direction.vo";
import { parseMessageStatus } from "@/domain/value-objects/message-status.vo";
import { parseMessageType } from "@/domain/value-objects/message-type.vo";
import { prisma } from "@/infrastructure/prisma/prisma.client";
import { MessageGetPayload } from "@/lib/generated/prisma/models";
import { EMessageStatus } from "@/types/enum";

export const messageSelect = {
  id: true,
  customerId: true,
  clientId: true,
  direction: true,
  messageType: true,
  status: true,
  content: true,
  payload: true,
  sentBy: true,
  createdAt: true,
} as const;

type TMessageRow = MessageGetPayload<{ select: typeof messageSelect }>;

export const toMessageEntity = (message: TMessageRow): TMessageEntity => ({
  id: message.id,
  customerId: message.customerId,
  clientId: message.clientId,
  direction: parseMessageDirection(message.direction),
  messageType: parseMessageType(message.messageType),
  status: parseMessageStatus(message.status),
  content: message.content,
  payload: message.payload,
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

  async findByClientId(clientId: string) {
    const message = await prisma.message.findUnique({
      where: { clientId },
      select: messageSelect,
    });

    return message ? toMessageEntity(message) : null;
  }

  async create(input: TCreateMessageInput) {
    const message = await prisma.message.create({
      data: {
        customerId: input.customerId,
        lineMessageId: input.lineMessageId ?? null,
        clientId: input.clientId ?? null,
        direction: input.direction,
        messageType: input.messageType,
        status: input.status ?? EMessageStatus.SENT,
        content: input.content,
        payload: (input.payload ?? undefined) as object | undefined,
        sentBy: input.sentBy ?? null,
      },
      select: messageSelect,
    });

    return toMessageEntity(message);
  }

  async updateStatus(id: string, status: EMessageStatus) {
    const message = await prisma.message.update({
      where: { id },
      data: { status },
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
