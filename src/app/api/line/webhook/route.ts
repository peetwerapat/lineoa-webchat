import { NextRequest } from "next/server";
import { webhook } from "@line/bot-sdk";

import { container } from "@/infrastructure/container";
import { verifyLineSignature } from "@/infrastructure/line/line.client";
import { toIngestInput } from "@/infrastructure/line/line-message.mapper";
import { apiError, apiSuccess } from "@/lib/apiResponse";
import { EHttpStatusCode } from "@/types/enum";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  if (!verifyLineSignature(rawBody, request.headers.get("x-line-signature"))) {
    return apiError(EHttpStatusCode.UNAUTHORIZED, "Invalid signature");
  }

  const body = JSON.parse(rawBody) as webhook.CallbackRequest;
  const inputs = (body.events ?? [])
    .map(toIngestInput)
    .filter((input) => input !== null);

  const results = await Promise.allSettled(
    inputs.map((input) => container.ingestLineMessage.execute(input))
  );

  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error("[line-webhook] event failed", result.reason);
    }
  });

  return apiSuccess({ received: inputs.length });
}
