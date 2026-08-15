import { MessagesSquare } from "lucide-react";

export const EmptyThread = () => (
  <div className="flex flex-1 flex-col items-center justify-center gap-2 text-muted-foreground">
    <MessagesSquare className="size-8" />
    <p className="text-sm">เลือกแชทจากรายการทางซ้ายเพื่อเริ่มตอบ</p>
  </div>
);
