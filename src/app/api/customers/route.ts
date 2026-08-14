import { container } from "@/infrastructure/container";

export const dynamic = "force-dynamic";

export async function GET() {
  const customers = await container.listCustomers.execute();

  return Response.json({ data: customers });
}
