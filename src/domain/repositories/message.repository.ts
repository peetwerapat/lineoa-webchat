import { TMessageEntity } from "@/domain/entities/message.entity";
import { EMessageDirection, EMessageStatus, EMessageType } from "@/types/enum";

export type TCreateMessageInput = {
  customerId: string;
  direction: EMessageDirection;
  messageType: EMessageType;
  content: string;
  lineMessageId?: string | null;
  clientId?: string | null;
  status?: EMessageStatus;
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
  findByClientId(clientId: string): Promise<TMessageEntity | null>;
  create(input: TCreateMessageInput): Promise<TMessageEntity>;
  updateStatus(id: string, status: EMessageStatus): Promise<TMessageEntity>;
  listByCustomer(params: TListMessagesParams): Promise<TMessageEntity[]>;
  countByCustomer(customerId: string): Promise<number>;
  findLatestByCustomer(customerId: string): Promise<TMessageEntity | null>;
}
