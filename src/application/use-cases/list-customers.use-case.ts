import { toCustomerDto } from "@/application/mappers/chat.mapper";
import { ICustomerRepository } from "@/domain/repositories/customer.repository";
import { TCustomer } from "@/types/chat/chatType";

const DEFAULT_TAKE = 100;

export class ListCustomersUseCase {
  constructor(private readonly _customerRepository: ICustomerRepository) {}

  async execute(take = DEFAULT_TAKE): Promise<TCustomer[]> {
    const customers = await this._customerRepository.listWithLastMessage(take);

    return customers.map((customer) =>
      toCustomerDto(customer, customer.lastMessage)
    );
  }
}
