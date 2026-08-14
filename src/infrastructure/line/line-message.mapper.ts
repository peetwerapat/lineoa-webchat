import "server-only";

import { webhook } from "@line/bot-sdk";

import { TIngestLineMessageInput } from "@/application/use-cases/ingest-line-message.use-case";
import { placeholderFor } from "@/domain/value-objects/message-type.vo";
import { EMessageType } from "@/types/enum";

const LINE_TYPE_TO_MESSAGE_TYPE: Record<string, EMessageType> = {
  text: EMessageType.TEXT,
  image: EMessageType.IMAGE,
  video: EMessageType.VIDEO,
  audio: EMessageType.AUDIO,
  file: EMessageType.FILE,
  sticker: EMessageType.STICKER,
  location: EMessageType.LOCATION,
};

export const toIngestInput = (
  event: webhook.Event
): TIngestLineMessageInput | null => {
  if (event.type !== "message" || event.source?.type !== "user") return null;

  const lineUserId = event.source.userId;
  if (!lineUserId) return null;

  const lineMessage = event.message;
  const messageType =
    LINE_TYPE_TO_MESSAGE_TYPE[lineMessage.type] ?? EMessageType.OTHER;

  return {
    lineUserId,
    lineMessageId: lineMessage.id,
    messageType,
    content:
      lineMessage.type === "text"
        ? lineMessage.text
        : placeholderFor(messageType),
    payload: lineMessage,
  };
};
