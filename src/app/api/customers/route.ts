import { container } from "@/infrastructure/container";
import { apiSuccess } from "@/lib/apiResponse";

export const dynamic = "force-dynamic";

export async function GET() {
  const customers = await container.listCustomers.execute();

  return apiSuccess(customers);
}
