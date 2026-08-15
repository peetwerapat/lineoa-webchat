import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { listStampOf } from "@/features/chat/util/messageDate";
import { cn } from "@/lib/utils";
import { TCustomer } from "@/types/chat/chatType";
import { EMessageDirection } from "@/types/enum";

type CustomerListItemProps = {
  customer: TCustomer;
  isActive: boolean;
  onSelect: (customerId: string) => void;
};

const UNKNOWN_NAME = "ลูกค้าไม่ทราบชื่อ";

const initialOf = (customer: TCustomer) =>
  customer.displayName ? customer.displayName.slice(0, 2).toUpperCase() : "?";

export const CustomerListItem = ({
  customer,
  isActive,
  onSelect,
}: CustomerListItemProps) => {
  const { lastMessage, unreadCount } = customer;
  const hasUnread = unreadCount > 0;

  return (
    <button
      type="button"
      onClick={() => onSelect(customer.id)}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
        isActive ? "bg-accent" : "hover:bg-accent/50"
      )}
    >
      <Avatar className="size-10 shrink-0">
        <AvatarImage src={customer.pictureUrl ?? undefined} alt="" />
        <AvatarFallback>{initialOf(customer)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p
            className={cn(
              "truncate text-sm",
              hasUnread ? "font-semibold" : "font-medium"
            )}
          >
            {customer.displayName ?? UNKNOWN_NAME}
          </p>
          {lastMessage ? (
            <span className="shrink-0 text-xs text-muted-foreground">
              {listStampOf(lastMessage.createdAt, new Date())}
            </span>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              "truncate text-xs",
              hasUnread
                ? "font-medium text-foreground"
                : "text-muted-foreground"
            )}
          >
            {lastMessage
              ? `${lastMessage.direction === EMessageDirection.OUTBOUND ? "คุณ: " : ""}${lastMessage.content}`
              : "ยังไม่มีข้อความ"}
          </p>

          {hasUnread ? (
            <Badge className="h-5 min-w-5 shrink-0 justify-center rounded-full px-1.5 text-[11px] tabular-nums">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          ) : null}
        </div>
      </div>
    </button>
  );
};
