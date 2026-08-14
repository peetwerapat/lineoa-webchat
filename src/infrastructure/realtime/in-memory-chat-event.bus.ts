import "server-only";

import { EventEmitter } from "node:events";

import { IChatEventBus } from "@/domain/gateways/chat-event.bus";
import { TChatEvent } from "@/types/chat/chatType";

const CHANNEL = "chat";

const globalForBus = globalThis as unknown as {
  chatBus?: EventEmitter;
};

export class InMemoryChatEventBus implements IChatEventBus {
  private readonly _emitter: EventEmitter;

  constructor() {
    this._emitter = globalForBus.chatBus ??= new EventEmitter();
    this._emitter.setMaxListeners(0);
  }

  publish(event: TChatEvent) {
    this._emitter.emit(CHANNEL, event);
  }

  subscribe(listener: (event: TChatEvent) => void) {
    this._emitter.on(CHANNEL, listener);

    return () => {
      this._emitter.off(CHANNEL, listener);
    };
  }
}
