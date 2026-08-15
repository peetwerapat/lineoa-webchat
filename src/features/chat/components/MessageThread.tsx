import { UIEvent, useEffect, useLayoutEffect, useRef } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageBubble } from "@/features/chat/components/MessageBubble";
import { groupMessagesByDay } from "@/features/chat/util/messageDate";
import { TCustomer, TMessage } from "@/types/chat/chatType";

type MessageThreadProps = {
  customer: TCustomer;
  messages: TMessage[];
  isLoading: boolean;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  onBack: () => void;
};

const LOAD_MORE_OFFSET = 80;
const STICK_TO_BOTTOM_OFFSET = 120;

export const MessageThread = ({
  customer,
  messages,
  isLoading,
  hasMore,
  isLoadingMore,
  onLoadMore,
  onBack,
}: MessageThreadProps) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const oldestMessageId = messages[0]?.id ?? null;
  const newestMessageId = messages[messages.length - 1]?.id ?? null;
  const previousOldestId = useRef(oldestMessageId);
  const scrollHeightBeforeLoad = useRef(0);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const isOlderPagePrepended =
      previousOldestId.current !== oldestMessageId &&
      scrollHeightBeforeLoad.current > 0;

    if (isOlderPagePrepended) {
      viewport.scrollTop +=
        viewport.scrollHeight - scrollHeightBeforeLoad.current;
      scrollHeightBeforeLoad.current = 0;
    }

    previousOldestId.current = oldestMessageId;
  }, [oldestMessageId]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const distanceFromBottom =
      viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;

    if (distanceFromBottom < STICK_TO_BOTTOM_OFFSET) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [newestMessageId]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || isLoading) return;

    viewport.scrollTop = viewport.scrollHeight;
  }, [customer.id, isLoading]);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    if (!hasMore || isLoadingMore) return;
    if (event.currentTarget.scrollTop > LOAD_MORE_OFFSET) return;

    scrollHeightBeforeLoad.current = event.currentTarget.scrollHeight;
    onLoadMore();
  };

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-2 md:gap-3 md:px-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 md:hidden"
          onClick={onBack}
        >
          <ChevronLeft className="size-5" />
          <span className="sr-only">กลับไปรายการแชท</span>
        </Button>

        <Avatar className="size-8">
          <AvatarImage src={customer.pictureUrl ?? undefined} alt="" />
          <AvatarFallback>
            {customer.displayName
              ? customer.displayName.slice(0, 2).toUpperCase()
              : "?"}
          </AvatarFallback>
        </Avatar>

        <p className="min-w-0 truncate text-sm font-medium">
          {customer.displayName ?? "ลูกค้าไม่ทราบชื่อ"}
        </p>

        <Badge variant="secondary" className="ml-auto">
          LINE
        </Badge>
      </header>

      <ScrollArea
        className="min-h-0 flex-1"
        viewportRef={viewportRef}
        onScroll={handleScroll}
      >
        <div className="space-y-3 p-4">
          {isLoadingMore ? (
            <div className="flex justify-center py-2">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : null}

          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                className={index % 2 === 0 ? "h-10 w-52" : "ml-auto h-10 w-40"}
              />
            ))
          ) : messages.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              ยังไม่มีข้อความในห้องนี้
            </p>
          ) : (
            groupMessagesByDay(messages, new Date()).map((group) => (
              <div key={group.dayKey} className="space-y-3">
                <div className="sticky top-0 z-10 flex justify-center py-1">
                  <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground">
                    {group.label}
                  </span>
                </div>

                {group.messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </>
  );
};
