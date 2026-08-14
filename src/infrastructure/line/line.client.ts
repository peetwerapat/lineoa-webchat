import "server-only";

import { messagingApi, validateSignature } from "@line/bot-sdk";

import { serverEnv } from "@/lib/env";

let client: messagingApi.MessagingApiClient | undefined;

export const lineClient = (): messagingApi.MessagingApiClient => {
  client ??= new messagingApi.MessagingApiClient({
    channelAccessToken: serverEnv.lineChannelAccessToken,
  });

  return client;
};

export const verifyLineSignature = (
  rawBody: string,
  signature: string | null
) => {
  if (!signature) return false;

  return validateSignature(rawBody, serverEnv.lineChannelSecret, signature);
};
