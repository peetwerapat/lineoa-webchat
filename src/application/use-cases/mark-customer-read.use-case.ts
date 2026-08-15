import { toCustomerDto } from "@/application/mappers/chat.mapper";
import { CustomerNotFoundError } from "@/application/use-cases/send-message.use-case";
import { IChatEventBus } from "@/domain/gateways/chat-event.bus";
import { ICustomerRepository } from "@/domain/repositories/customer.repository";
import { IMessageRepository } from "@/domain/repositories/message.repository";
import { TCustomer } from "@/types/chat/chatType";

export class MarkCustomerReadUseCase {
  constructor(
    private readonly _customerRepository: ICustomerRepository,
    private readonly _messageRepository: IMessageRepository,
    private readonly _chatEventBus: IChatEventBus
  ) {}

  async execute(customerId: string): Promise<TCustomer> {
    const existing = await this._customerRepository.findById(customerId);
    if (!existing) throw new CustomerNotFoundError(customerId);

    const customer = await this._customerRepository.markRead(customerId);
    const lastMessage =
      await this._messageRepository.findLatestByCustomer(customerId);
    const dto = toCustomerDto(customer, lastMessage);

    this._chatEventBus.publish({
      type: "customer.updated",
      customerId: customer.id,
      customer: dto,
    });

    return dto;
  }
}
