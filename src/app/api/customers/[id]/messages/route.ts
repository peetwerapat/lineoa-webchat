import { NextRequest } from "next/server";
import { HTTPFetchError } from "@line/bot-sdk";

import { CustomerNotFoundError } from "@/application/use-cases/send-message.use-case";
import { container } from "@/infrastructure/container";
import { EHttpStatusCode } from "@/types/enum";

export const dynamic = "force-dynamic";

type TMessageRoute = RouteContext<"/api/customers/[id]/messages">;

export async function GET(_request: NextRequest, ctx: TMessageRoute) {
  const { id } = await ctx.params;
  const messages = await container.listMessages.execute(id);

  return Response.json({ data: messages });
}

export async function POST(request: NextRequest, ctx: TMessageRoute) {
  const { id } = await ctx.params;
  const body = (await request.json()) as {
    content?: unknown;
    sentBy?: unknown;
  };

  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (!content) {
    return Response.json(
      { message: "content is required" },
      { status: EHttpStatusCode.BAD_REQUEST }
    );
  }

  try {
    const message = await container.sendMessage.execute({
      customerId: id,
      content,
      sentBy: typeof body.sentBy === "string" ? body.sentBy : undefined,
    });

    return Response.json(
      { data: message },
      { status: EHttpStatusCode.CREATED }
    );
  } catch (error) {
    if (error instanceof CustomerNotFoundError) {
      return Response.json(
        { message: "Customer not found" },
        { status: EHttpStatusCode.NOT_FOUND }
      );
    }

    if (error instanceof HTTPFetchError) {
      console.error(
        "[send-message] LINE push failed",
        error.status,
        error.body
      );

      return Response.json(
        { message: "Failed to deliver the message to LINE" },
        { status: EHttpStatusCode.SERVER_ERROR }
      );
    }

    throw error;
  }
}
