import {
  TCustomerEntity,
  TCustomerWithLastMessage,
} from "@/domain/entities/customer.entity";

export type TCreateCustomerInput = {
  lineUserId: string;
  displayName: string | null;
  pictureUrl: string | null;
};

export interface ICustomerRepository {
  findById(id: string): Promise<TCustomerEntity | null>;
  findByLineUserId(lineUserId: string): Promise<TCustomerEntity | null>;
  create(input: TCreateCustomerInput): Promise<TCustomerEntity>;
  incrementUnread(id: string): Promise<TCustomerEntity>;
  markRead(id: string): Promise<TCustomerEntity>;
  listWithLastMessage(take: number): Promise<TCustomerWithLastMessage[]>;
}
