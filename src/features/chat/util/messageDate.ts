import { TMessage } from "@/types/chat/chatType";

export type TMessageDayGroup = {
  dayKey: string;
  label: string;
  messages: TMessage[];
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DAYS_IN_WEEK = 7;

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const dayKeyOf = (date: Date) => startOfDay(date).getTime().toString();

const daysBefore = (date: Date, reference: Date) =>
  Math.round(
    (startOfDay(reference).getTime() - startOfDay(date).getTime()) / MS_PER_DAY
  );

export const timeLabelOf = (date: Date) =>
  date.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });

export const dayLabelOf = (date: Date, now: Date) => {
  const offset = daysBefore(date, now);

  if (offset === 0) return "วันนี้";
  if (offset === 1) return "เมื่อวาน";

  return date.toLocaleDateString("th-TH", {
    weekday: offset < DAYS_IN_WEEK ? "long" : undefined,
    day: "numeric",
    month: "short",
    year: date.getFullYear() === now.getFullYear() ? undefined : "numeric",
  });
};

export const listStampOf = (isoDate: string, now: Date) => {
  const date = new Date(isoDate);
  const offset = daysBefore(date, now);

  if (offset === 0) return timeLabelOf(date);
  if (offset === 1) return "เมื่อวาน";
  if (offset < DAYS_IN_WEEK)
    return date.toLocaleDateString("th-TH", { weekday: "short" });

  return date.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() === now.getFullYear() ? undefined : "2-digit",
  });
};

export const groupMessagesByDay = (
  messages: TMessage[],
  now: Date
): TMessageDayGroup[] =>
  messages.reduce<TMessageDayGroup[]>((groups, message) => {
    const date = new Date(message.createdAt);
    const dayKey = dayKeyOf(date);
    const current = groups.at(-1);

    if (current?.dayKey === dayKey) {
      current.messages.push(message);

      return groups;
    }

    groups.push({ dayKey, label: dayLabelOf(date, now), messages: [message] });

    return groups;
  }, []);
