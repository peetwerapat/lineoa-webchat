import { NextRequest } from "next/server";

import { CustomerNotFoundError } from "@/application/use-cases/send-message.use-case";
import { container } from "@/infrastructure/container";
import { apiError, apiSuccess } from "@/lib/apiResponse";
import { EHttpStatusCode } from "@/types/enum";

export const dynamic = "force-dynamic";

type TReadRoute = RouteContext<"/api/customers/[id]/read">;

export async function PATCH(_request: NextRequest, ctx: TReadRoute) {
  const { id } = await ctx.params;

  try {
    const customer = await container.markCustomerRead.execute(id);

    return apiSuccess(customer, { message: "Marked as read" });
  } catch (error) {
    if (error instanceof CustomerNotFoundError) {
      return apiError(EHttpStatusCode.NOT_FOUND, "Customer not found");
    }

    throw error;
  }
}
