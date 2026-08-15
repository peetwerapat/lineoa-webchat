import { toCustomerDto, toMessageDto } from "@/application/mappers/chat.mapper";
import { IChatEventBus } from "@/domain/gateways/chat-event.bus";
import { ILineMessagingGateway } from "@/domain/gateways/line-messaging.gateway";
import { ICustomerRepository } from "@/domain/repositories/customer.repository";
import { IMessageRepository } from "@/domain/repositories/message.repository";
import { TMessage } from "@/types/chat/chatType";
import { EMessageDirection, EMessageStatus, EMessageType } from "@/types/enum";

export type TSendMessageInput = {
  customerId: string;
  content: string;
  clientId?: string;
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

    const existing = input.clientId
      ? await this._messageRepository.findByClientId(input.clientId)
      : null;

    // A retry of an already delivered message must not push to LINE twice.
    if (existing?.status === EMessageStatus.SENT) return toMessageDto(existing);

    const pending =
      existing ??
      (await this._messageRepository.create({
        customerId: customer.id,
        clientId: input.clientId ?? null,
        direction: EMessageDirection.OUTBOUND,
        messageType: EMessageType.TEXT,
        status: EMessageStatus.PENDING,
        content: input.content,
        sentBy: input.sentBy ?? null,
      }));

    try {
      await this._lineMessagingGateway.pushText(
        customer.lineUserId,
        pending.content
      );
    } catch (error) {
      await this._messageRepository.updateStatus(
        pending.id,
        EMessageStatus.FAILED
      );

      throw error;
    }

    const message = await this._messageRepository.updateStatus(
      pending.id,
      EMessageStatus.SENT
    );

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
