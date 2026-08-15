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
    <form onSubmit={handleSubmit} className="flex shrink-0 gap-2 border-t p-3">
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="พิมพ์ข้อความ..."
        autoComplete="off"
        disabled={isSending}
      />
      <Button type="submit" size="icon" disabled={isSending || !value.trim()}>
        <SendHorizontal className="size-4" />
        <span className="sr-only">ส่ง</span>
      </Button>
    </form>
  );
};
