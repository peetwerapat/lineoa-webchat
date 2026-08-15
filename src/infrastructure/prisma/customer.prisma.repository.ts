import "server-only";

import { TCustomerEntity } from "@/domain/entities/customer.entity";
import {
  ICustomerRepository,
  TCreateCustomerInput,
} from "@/domain/repositories/customer.repository";
import {
  messageSelect,
  toMessageEntity,
} from "@/infrastructure/prisma/message.prisma.repository";
import { prisma } from "@/infrastructure/prisma/prisma.client";
import { CustomerGetPayload } from "@/lib/generated/prisma/models";

const customerSelect = {
  id: true,
  lineUserId: true,
  displayName: true,
  pictureUrl: true,
  unreadCount: true,
} as const;

const customerWithLastMessageSelect = {
  ...customerSelect,
  messages: { orderBy: { createdAt: "desc" }, take: 1, select: messageSelect },
} as const;

type TCustomerRow = CustomerGetPayload<{ select: typeof customerSelect }>;

const toCustomerEntity = (customer: TCustomerRow): TCustomerEntity => ({
  id: customer.id,
  lineUserId: customer.lineUserId,
  displayName: customer.displayName,
  pictureUrl: customer.pictureUrl,
  unreadCount: customer.unreadCount,
});

export class CustomerPrismaRepository implements ICustomerRepository {
  async findById(id: string) {
    const customer = await prisma.customer.findUnique({
      where: { id },
      select: customerSelect,
    });

    return customer ? toCustomerEntity(customer) : null;
  }

  async findByLineUserId(lineUserId: string) {
    const customer = await prisma.customer.findUnique({
      where: { lineUserId },
      select: customerSelect,
    });

    return customer ? toCustomerEntity(customer) : null;
  }

  async create(input: TCreateCustomerInput) {
    const customer = await prisma.customer.create({
      data: input,
      select: customerSelect,
    });

    return toCustomerEntity(customer);
  }

  async incrementUnread(id: string) {
    const customer = await prisma.customer.update({
      where: { id },
      data: { unreadCount: { increment: 1 } },
      select: customerSelect,
    });

    return toCustomerEntity(customer);
  }

  async markRead(id: string) {
    const customer = await prisma.customer.update({
      where: { id },
      data: { unreadCount: 0, lastReadAt: new Date() },
      select: customerSelect,
    });

    return toCustomerEntity(customer);
  }

  async listWithLastMessage(take: number) {
    const customers = await prisma.customer.findMany({
      take,
      select: customerWithLastMessageSelect,
    });

    return customers
      .map((customer) => ({
        ...toCustomerEntity(customer),
        lastMessage: customer.messages[0]
          ? toMessageEntity(customer.messages[0])
          : null,
      }))
      .sort(
        (a, b) =>
          (b.lastMessage?.createdAt.getTime() ?? 0) -
          (a.lastMessage?.createdAt.getTime() ?? 0)
      );
  }
}
