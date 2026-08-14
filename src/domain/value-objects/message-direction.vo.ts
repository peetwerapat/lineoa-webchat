import { EMessageDirection } from "@/types/enum";

export const parseMessageDirection = (value: string): EMessageDirection =>
  value.toUpperCase() === EMessageDirection.OUTBOUND
    ? EMessageDirection.OUTBOUND
    : EMessageDirection.INBOUND;
