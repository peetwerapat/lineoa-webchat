import { StickerBubble } from "@/features/chat/components/StickerBubble";
import { timeLabelOf } from "@/features/chat/util/messageDate";
import { cn } from "@/lib/utils";
import { TMessage } from "@/types/chat/chatType";
import { EMessageDirection, EMessageStatus, EMessageType } from "@/types/enum";

type MessageBubbleProps = {
  message: TMessage;
  onRetry: (message: TMessage) => void;
};

export const MessageBubble = ({ message, onRetry }: MessageBubbleProps) => {
  const isOutbound = message.direction === EMessageDirection.OUTBOUND;
  const isText = message.messageType === EMessageType.TEXT;
  const sticker =
    message.messageType === EMessageType.STICKER ? message.sticker : null;
  const isPending = message.status === EMessageStatus.PENDING;
  const hasFailed = message.status === EMessageStatus.FAILED;

  return (
    <div className={cn("flex", isOutbound ? "justify-end" : "justify-start")}>
      <div className="max-w-[85%] space-y-1 md:max-w-[70%]">
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
              hasFailed && "bg-destructive/10 text-foreground",
              !isText && "italic opacity-80"
            )}
          >
            {message.content}
          </div>
        )}

        {/* Nothing under the bubble until the message lands, the way LINE does it. */}
        {isPending ? null : (
          <p
            className={cn(
              "flex items-center gap-1.5 px-1 text-[11px] text-muted-foreground",
              isOutbound ? "justify-end" : "justify-start"
            )}
          >
            {hasFailed ? (
              <>
                <span className="text-destructive">ส่งไม่สำเร็จ</span>
                <button
                  type="button"
                  onClick={() => onRetry(message)}
                  className="font-medium text-destructive underline underline-offset-2"
                >
                  ลองใหม่
                </button>
              </>
            ) : (
              <>
                <span>{timeLabelOf(new Date(message.createdAt))}</span>
                {isOutbound && message.sentBy ? (
                  <span>· {message.sentBy}</span>
                ) : null}
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
};
