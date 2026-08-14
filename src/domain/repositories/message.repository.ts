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

export interface IMessageRepository {
  findByLineMessageId(lineMessageId: string): Promise<TMessageEntity | null>;
  create(input: TCreateMessageInput): Promise<TMessageEntity>;
  listByCustomer(customerId: string, take: number): Promise<TMessageEntity[]>;
}
