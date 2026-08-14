import { NextRequest } from "next/server";

import { CustomerNotFoundError } from "@/application/use-cases/send-message.use-case";
import { container } from "@/infrastructure/container";
import { EHttpStatusCode } from "@/types/enum";

export const dynamic = "force-dynamic";

type TReadRoute = RouteContext<"/api/customers/[id]/read">;

export async function PATCH(_request: NextRequest, ctx: TReadRoute) {
  const { id } = await ctx.params;

  try {
    const customer = await container.markCustomerRead.execute(id);

    return Response.json({ data: customer });
  } catch (error) {
    if (error instanceof CustomerNotFoundError) {
      return Response.json(
        { message: "Customer not found" },
        { status: EHttpStatusCode.NOT_FOUND }
      );
    }

    throw error;
  }
}
