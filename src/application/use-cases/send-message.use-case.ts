import { toCustomerDto, toMessageDto } from "@/application/mappers/chat.mapper";
import { IChatEventBus } from "@/domain/gateways/chat-event.bus";
import { ILineMessagingGateway } from "@/domain/gateways/line-messaging.gateway";
import { ICustomerRepository } from "@/domain/repositories/customer.repository";
import { IMessageRepository } from "@/domain/repositories/message.repository";
import { TMessage } from "@/types/chat/chatType";
import { EMessageDirection, EMessageType } from "@/types/enum";

export type TSendMessageInput = {
  customerId: string;
  content: string;
  sentBy?: string;
};

export class CustomerNotFoundError extends Error {
  constructor(customerId: string) {
    super(`Customer not found: ${customerId}`);
    this.name = "CustomerNotFoundError";
  }
}

export class SendMessageUseCase {
  constructor(
    private readonly _customerRepository: ICustomerRepository,
    private readonly _messageRepository: IMessageRepository,
    private readonly _lineMessagingGateway: ILineMessagingGateway,
    private readonly _chatEventBus: IChatEventBus
  ) {}

  async execute(input: TSendMessageInput): Promise<TMessage> {
    const customer = await this._customerRepository.findById(input.customerId);
    if (!customer) throw new CustomerNotFoundError(input.customerId);

    await this._lineMessagingGateway.pushText(
      customer.lineUserId,
      input.content
    );

    const message = await this._messageRepository.create({
      customerId: customer.id,
      direction: EMessageDirection.OUTBOUND,
      messageType: EMessageType.TEXT,
      content: input.content,
      sentBy: input.sentBy ?? null,
    });

    this._chatEventBus.publish({
      type: "message.created",
      customerId: customer.id,
      message: toMessageDto(message),
    });
    this._chatEventBus.publish({
      type: "customer.updated",
      customerId: customer.id,
      customer: toCustomerDto(customer, message),
    });

    return toMessageDto(message);
  }
}
