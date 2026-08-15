import { toMessageDto } from "@/application/mappers/chat.mapper";
import { DEFAULT_MESSAGE_LIMIT, MAX_MESSAGE_LIMIT } from "@/constants/chat";
import { IMessageRepository } from "@/domain/repositories/message.repository";
import { TMessage } from "@/types/chat/chatType";
import { IPagination } from "@/types/globalType";

export type TListMessagesInput = {
  customerId: string;
  page?: number;
  limit?: number;
};

export type TListMessagesResult = {
  data: TMessage[];
  meta: IPagination;
};

export class ListMessagesUseCase {
  constructor(private readonly _messageRepository: IMessageRepository) {}

  async execute(input: TListMessagesInput): Promise<TListMessagesResult> {
    const page = Math.max(1, input.page ?? 1);
    const limit = Math.min(
      MAX_MESSAGE_LIMIT,
      Math.max(1, input.limit ?? DEFAULT_MESSAGE_LIMIT)
    );

    const [messages, totalCount] = await Promise.all([
      this._messageRepository.listByCustomer({
        customerId: input.customerId,
        page,
        limit,
      }),
      this._messageRepository.countByCustomer(input.customerId),
    ]);

    return {
      data: messages.reverse().map(toMessageDto),
      meta: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }
}
