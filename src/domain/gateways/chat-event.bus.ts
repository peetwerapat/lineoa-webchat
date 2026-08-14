import { TChatEvent } from "@/types/chat/chatType";

export interface IChatEventBus {
  publish(event: TChatEvent): void;
  subscribe(listener: (event: TChatEvent) => void): () => void;
}
