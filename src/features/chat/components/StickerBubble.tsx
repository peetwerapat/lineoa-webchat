import { useState } from "react";
import Image from "next/image";

import { TSticker } from "@/types/chat/chatType";

type StickerBubbleProps = {
  sticker: TSticker;
};

export const StickerBubble = ({ sticker }: StickerBubbleProps) => {
  const [source, setSource] = useState(sticker.imageUrl);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="rounded-2xl bg-muted px-4 py-2 text-sm text-foreground italic opacity-80">
        [sticker]
      </div>
    );
  }

  return (
    <Image
      src={source}
      alt="sticker"
      width={148}
      height={148}
      unoptimized
      className="h-[148px] w-[148px] object-contain"
      onError={() => {
        if (source !== sticker.fallbackImageUrl) {
          setSource(sticker.fallbackImageUrl);

          return;
        }

        setFailed(true);
      }}
    />
  );
};
