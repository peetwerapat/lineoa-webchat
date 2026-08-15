import { TSticker } from "@/types/chat/chatType";

const STICKER_CDN_BASE =
  "https://stickershop.line-scdn.net/stickershop/v1/sticker";

const ANIMATED_RESOURCE_TYPES = new Set([
  "ANIMATION",
  "ANIMATION_SOUND",
  "POPUP",
  "POPUP_SOUND",
]);

const staticUrlFor = (stickerId: string) =>
  `${STICKER_CDN_BASE}/${stickerId}/iPhone/sticker@2x.png`;

const animationUrlFor = (stickerId: string) =>
  `${STICKER_CDN_BASE}/${stickerId}/iPhone/sticker_animation@2x.png`;

const readString = (source: Record<string, unknown>, key: string) => {
  const value = source[key];

  return typeof value === "string" && value.length > 0 ? value : null;
};

export const parseSticker = (payload: unknown): TSticker | null => {
  if (!payload || typeof payload !== "object") return null;

  const source = payload as Record<string, unknown>;
  const stickerId = readString(source, "stickerId");
  if (!stickerId) return null;

  const resourceType = (
    readString(source, "stickerResourceType") ?? "STATIC"
  ).toUpperCase();

  return {
    packageId: readString(source, "packageId"),
    stickerId,
    resourceType,
    imageUrl: ANIMATED_RESOURCE_TYPES.has(resourceType)
      ? animationUrlFor(stickerId)
      : staticUrlFor(stickerId),
    fallbackImageUrl: staticUrlFor(stickerId),
  };
};
