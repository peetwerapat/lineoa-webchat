import "server-only";

import { TCustomerEntity } from "@/domain/entities/customer.entity";
import {
  ICustomerRepository,
  TCreateCustomerInput,
} from "@/domain/repositories/customer.repository";
import { toMessageEntity } from "@/infrastructure/prisma/message.prisma.repository";
import { prisma } from "@/infrastructure/prisma/prisma.client";
import { CustomerModel, MessageModel } from "@/lib/generated/prisma/models";

type TCustomerRow = CustomerModel & { messages?: MessageModel[] };

const toCustomerEntity = (customer: TCustomerRow): TCustomerEntity => ({
  id: customer.id,
  lineUserId: customer.lineUserId,
  displayName: customer.displayName,
  pictureUrl: customer.pictureUrl,
  unreadCount: customer.unreadCount,
  lastReadAt: customer.lastReadAt,
  createdAt: customer.createdAt,
  updatedAt: customer.updatedAt,
});

export class CustomerPrismaRepository implements ICustomerRepository {
  async findById(id: string) {
    const customer = await prisma.customer.findUnique({ where: { id } });

    return customer ? toCustomerEntity(customer) : null;
  }

  async findByLineUserId(lineUserId: string) {
    const customer = await prisma.customer.findUnique({
      where: { lineUserId },
    });

    return customer ? toCustomerEntity(customer) : null;
  }

  async create(input: TCreateCustomerInput) {
    const customer = await prisma.customer.create({ data: input });

    return toCustomerEntity(customer);
  }

  async incrementUnread(id: string) {
    const customer = await prisma.customer.update({
      where: { id },
      data: { unreadCount: { increment: 1 } },
    });

    return toCustomerEntity(customer);
  }

  async markRead(id: string) {
    const customer = await prisma.customer.update({
      where: { id },
      data: { unreadCount: 0, lastReadAt: new Date() },
    });

    return toCustomerEntity(customer);
  }

  async listWithLastMessage(take: number) {
    const customers = await prisma.customer.findMany({
      include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
      take,
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
