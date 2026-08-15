import { TMessageEntity } from "@/domain/entities/message.entity";
import { EMessageDirection, EMessageType } from "@/types/enum";

export type TCreateMessageInput = {
  customerId: string;
  direction: EMessageDirection;
  messageType: EMessageType;
  content: string;
  lineMessageId?: string | null;
  payload?: unknown;
  sentBy?: string | null;
};

export type TListMessagesParams = {
  customerId: string;
  page: number;
  limit: number;
};

export interface IMessageRepository {
  findByLineMessageId(lineMessageId: string): Promise<TMessageEntity | null>;
  create(input: TCreateMessageInput): Promise<TMessageEntity>;
  listByCustomer(params: TListMessagesParams): Promise<TMessageEntity[]>;
  countByCustomer(customerId: string): Promise<number>;
  findLatestByCustomer(customerId: string): Promise<TMessageEntity | null>;
}
