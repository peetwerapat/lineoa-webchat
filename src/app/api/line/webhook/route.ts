import { NextRequest } from "next/server";
import { webhook } from "@line/bot-sdk";

import { container } from "@/infrastructure/container";
import { verifyLineSignature } from "@/infrastructure/line/line.client";
import { toIngestInput } from "@/infrastructure/line/line-message.mapper";
import { EHttpStatusCode } from "@/types/enum";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  if (!verifyLineSignature(rawBody, request.headers.get("x-line-signature"))) {
    return Response.json(
      { message: "Invalid signature" },
      { status: EHttpStatusCode.UNAUTHORIZED }
    );
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

  return Response.json({ data: { ok: true } });
}
