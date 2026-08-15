import { MessageSquare } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomerListItem } from "@/features/chat/components/CustomerListItem";
import { TCustomer } from "@/types/chat/chatType";

type CustomerListProps = {
  customers: TCustomer[];
  activeCustomerId: string | null;
  isLoading: boolean;
  onSelect: (customerId: string) => void;
};

export const CustomerList = ({
  customers,
  activeCustomerId,
  isLoading,
  onSelect,
}: CustomerListProps) => (
  <aside className="flex h-full w-80 shrink-0 flex-col overflow-hidden border-r">
    <div className="flex h-14 items-center gap-2 border-b px-4">
      <MessageSquare className="size-4 text-muted-foreground" />
      <h1 className="text-sm font-semibold">แชททั้งหมด</h1>
      {!isLoading ? (
        <span className="ml-auto text-xs text-muted-foreground">
          {customers.length}
        </span>
      ) : null}
    </div>

    <ScrollArea className="min-h-0 flex-1">
      <div className="space-y-1 p-2">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 px-3 py-2.5">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          ))
        ) : customers.length === 0 ? (
          <p className="px-3 py-8 text-center text-sm text-muted-foreground">
            ยังไม่มีลูกค้าทักเข้ามา
          </p>
        ) : (
          customers.map((customer) => (
            <CustomerListItem
              key={customer.id}
              customer={customer}
              isActive={customer.id === activeCustomerId}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </ScrollArea>
  </aside>
);
