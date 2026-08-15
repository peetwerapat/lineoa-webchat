import { SubmitEvent } from "react";
import { SendHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type MessageComposerProps = {
  value: string;
  isSending: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export const MessageComposer = ({
  value,
  isSending,
  onChange,
  onSubmit,
}: MessageComposerProps) => {
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex shrink-0 gap-2 border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="พิมพ์ข้อความ..."
        autoComplete="off"
        disabled={isSending}
        className="h-10 md:h-8"
      />
      <Button
        type="submit"
        size="icon"
        className="size-10 shrink-0 md:size-8"
        disabled={isSending || !value.trim()}
      >
        <SendHorizontal className="size-4" />
        <span className="sr-only">ส่ง</span>
      </Button>
    </form>
  );
};
