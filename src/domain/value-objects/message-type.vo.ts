import { EMessageType } from "@/types/enum";

export const parseMessageType = (value: string): EMessageType => {
  const messageType = value.toUpperCase() as EMessageType;

  return Object.values(EMessageType).includes(messageType)
    ? messageType
    : EMessageType.OTHER;
};

export const placeholderFor = (messageType: EMessageType) =>
  `[${messageType.toLowerCase()}]`;
