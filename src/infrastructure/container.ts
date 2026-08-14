import "server-only";

import { IngestLineMessageUseCase } from "@/application/use-cases/ingest-line-message.use-case";
import { ListCustomersUseCase } from "@/application/use-cases/list-customers.use-case";
import { ListMessagesUseCase } from "@/application/use-cases/list-messages.use-case";
import { MarkCustomerReadUseCase } from "@/application/use-cases/mark-customer-read.use-case";
import { SendMessageUseCase } from "@/application/use-cases/send-message.use-case";
import { LineMessagingGateway } from "@/infrastructure/line/line-messaging.gateway.impl";
import { CustomerPrismaRepository } from "@/infrastructure/prisma/customer.prisma.repository";
import { MessagePrismaRepository } from "@/infrastructure/prisma/message.prisma.repository";
import { InMemoryChatEventBus } from "@/infrastructure/realtime/in-memory-chat-event.bus";

const customerRepository = new CustomerPrismaRepository();
const messageRepository = new MessagePrismaRepository();
const lineMessagingGateway = new LineMessagingGateway();
const chatEventBus = new InMemoryChatEventBus();

export const container = {
  chatEventBus,
  ingestLineMessage: new IngestLineMessageUseCase(
    customerRepository,
    messageRepository,
    lineMessagingGateway,
    chatEventBus
  ),
  sendMessage: new SendMessageUseCase(
    customerRepository,
    messageRepository,
    lineMessagingGateway,
    chatEventBus
  ),
  listCustomers: new ListCustomersUseCase(customerRepository),
  listMessages: new ListMessagesUseCase(messageRepository),
  markCustomerRead: new MarkCustomerReadUseCase(
    customerRepository,
    messageRepository,
    chatEventBus
  ),
};
