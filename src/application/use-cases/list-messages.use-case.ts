import { toMessageDto } from "@/application/mappers/chat.mapper";
import { IMessageRepository } from "@/domain/repositories/message.repository";
import { TMessage } from "@/types/chat/chatType";

const DEFAULT_TAKE = 50;

export class ListMessagesUseCase {
  constructor(private readonly _messageRepository: IMessageRepository) {}

  async execute(customerId: string, take = DEFAULT_TAKE): Promise<TMessage[]> {
    const messages = await this._messageRepository.listByCustomer(
      customerId,
      take
    );

    return messages.reverse().map(toMessageDto);
  }
}
