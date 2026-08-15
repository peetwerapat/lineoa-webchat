import { StickerBubble } from "@/features/chat/components/StickerBubble";
import { timeLabelOf } from "@/features/chat/util/messageDate";
import { cn } from "@/lib/utils";
import { TMessage } from "@/types/chat/chatType";
import { EMessageDirection, EMessageType } from "@/types/enum";

type MessageBubbleProps = {
  message: TMessage;
};

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isOutbound = message.direction === EMessageDirection.OUTBOUND;
  const isText = message.messageType === EMessageType.TEXT;
  const sticker =
    message.messageType === EMessageType.STICKER ? message.sticker : null;

  return (
    <div className={cn("flex", isOutbound ? "justify-end" : "justify-start")}>
      <div className="max-w-[70%] space-y-1">
        {sticker ? (
          <div
            className={cn("flex", isOutbound ? "justify-end" : "justify-start")}
          >
            <StickerBubble key={sticker.imageUrl} sticker={sticker} />
          </div>
        ) : (
          <div
            className={cn(
              "rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap break-words",
              isOutbound
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground",
              !isText && "italic opacity-80"
            )}
          >
            {message.content}
          </div>
        )}

        <p
          className={cn(
            "px-1 text-[11px] text-muted-foreground",
            isOutbound ? "text-right" : "text-left"
          )}
        >
          {timeLabelOf(new Date(message.createdAt))}
          {isOutbound && message.sentBy ? ` · ${message.sentBy}` : ""}
        </p>
      </div>
    </div>
  );
};
