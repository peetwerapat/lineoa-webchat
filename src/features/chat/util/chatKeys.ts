export const chatKeys = {
  customers: ["customers"],
  messages: (customerId: string) => ["messages", customerId],
};
