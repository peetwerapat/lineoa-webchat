import { NextRequest } from "next/server";
import { HTTPFetchError } from "@line/bot-sdk";

import { CustomerNotFoundError } from "@/application/use-cases/send-message.use-case";
import { container } from "@/infrastructure/container";
import {
  apiError,
  apiSuccess,
  apiSuccessWithPaginate,
} from "@/lib/apiResponse";
import { EHttpStatusCode } from "@/types/enum";

export const dynamic = "force-dynamic";

type TMessageRoute = RouteContext<"/api/customers/[id]/messages">;

const toPositiveInt = (value: string | null) => {
  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
};

export async function GET(request: NextRequest, ctx: TMessageRoute) {
  const { id } = await ctx.params;
  const { searchParams } = request.nextUrl;

  const { data, meta } = await container.listMessages.execute({
    customerId: id,
    page: toPositiveInt(searchParams.get("page")),
    limit: toPositiveInt(searchParams.get("limit")),
  });

  return apiSuccessWithPaginate(data, meta);
}

export async function POST(request: NextRequest, ctx: TMessageRoute) {
  const { id } = await ctx.params;
  const body = (await request.json()) as {
    content?: unknown;
    clientId?: unknown;
    sentBy?: unknown;
  };

  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (!content) {
    return apiError(EHttpStatusCode.BAD_REQUEST, "content is required");
  }

  try {
    const message = await container.sendMessage.execute({
      customerId: id,
      content,
      clientId: typeof body.clientId === "string" ? body.clientId : undefined,
      sentBy: typeof body.sentBy === "string" ? body.sentBy : undefined,
    });

    return apiSuccess(message, {
      statusCode: EHttpStatusCode.CREATED,
      message: "Message sent",
    });
  } catch (error) {
    if (error instanceof CustomerNotFoundError) {
      return apiError(EHttpStatusCode.NOT_FOUND, "Customer not found");
    }

    if (error instanceof HTTPFetchError) {
      console.error(
        "[send-message] LINE push failed",
        error.status,
        error.body
      );

      return apiError(
        EHttpStatusCode.SERVER_ERROR,
        "Failed to deliver the message to LINE"
      );
    }

    throw error;
  }
}
