import "server-only";

import {
  ILineMessagingGateway,
  TLineProfile,
} from "@/domain/gateways/line-messaging.gateway";
import { lineClient } from "@/infrastructure/line/line.client";

export class LineMessagingGateway implements ILineMessagingGateway {
  async pushText(lineUserId: string, content: string) {
    await lineClient().pushMessage({
      to: lineUserId,
      messages: [{ type: "text", text: content }],
    });
  }

  async fetchProfile(lineUserId: string): Promise<TLineProfile | null> {
    try {
      const profile = await lineClient().getProfile(lineUserId);

      return {
        displayName: profile.displayName ?? null,
        pictureUrl: profile.pictureUrl ?? null,
      };
    } catch {
      return null;
    }
  }
}
