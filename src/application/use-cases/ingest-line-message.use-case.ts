import { toCustomerDto, toMessageDto } from "@/application/mappers/chat.mapper";
import { TCustomerEntity } from "@/domain/entities/customer.entity";
import { TMessageEntity } from "@/domain/entities/message.entity";
import { IChatEventBus } from "@/domain/gateways/chat-event.bus";
import { ILineMessagingGateway } from "@/domain/gateways/line-messaging.gateway";
import { ICustomerRepository } from "@/domain/repositories/customer.repository";
import { IMessageRepository } from "@/domain/repositories/message.repository";
import { EMessageDirection, EMessageType } from "@/types/enum";

export type TIngestLineMessageInput = {
  lineUserId: string;
  lineMessageId: string;
  messageType: EMessageType;
  content: string;
  payload: unknown;
};

export class IngestLineMessageUseCase {
  constructor(
    private readonly _customerRepository: ICustomerRepository,
    private readonly _messageRepository: IMessageRepository,
    private readonly _lineMessagingGateway: ILineMessagingGateway,
    private readonly _chatEventBus: IChatEventBus
  ) {}

  async execute(input: TIngestLineMessageInput) {
    const duplicated = await this._messageRepository.findByLineMessageId(
      input.lineMessageId
    );
    if (duplicated) return duplicated;

    const customer = await this._ensureCustomer(input.lineUserId);

    const message = await this._messageRepository.create({
      customerId: customer.id,
      lineMessageId: input.lineMessageId,
      direction: EMessageDirection.INBOUND,
      messageType: input.messageType,
      content: input.content,
      payload: input.payload,
    });

    const updated = await this._customerRepository.incrementUnread(customer.id);

    this._publish(updated, message);

    return message;
  }

  private async _ensureCustomer(lineUserId: string) {
    const existing =
      await this._customerRepository.findByLineUserId(lineUserId);
    if (existing) return existing;

    const profile = await this._lineMessagingGateway.fetchProfile(lineUserId);

    return this._customerRepository.create({
      lineUserId,
      displayName: profile?.displayName ?? null,
      pictureUrl: profile?.pictureUrl ?? null,
    });
  }

  private _publish(customer: TCustomerEntity, message: TMessageEntity) {
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
  }
}
