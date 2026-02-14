import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { getQueryClient, trpc } from "~/trpc/server";

export default async function InventoryItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const queryClient = getQueryClient();
  const items = await queryClient.fetchQuery(trpc.inventory.all.queryOptions());
  const item = items.find((entry) => entry.id === id);

  if (!item) {
    notFound();
  }

  return (
    <div className="space-y-4 p-4">
      <Button asChild variant="outline" size="sm">
        <Link href="/administration/inventory">Back to inventory</Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{item.name}</CardTitle>
          <CardDescription>{item.type}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p>
            <span className="font-medium">Notes:</span> {item.note ?? "-"}
          </p>

          {item.type === "ASSET" ? (
            <div className="space-y-2">
              <p>
                <span className="font-medium">SKU:</span>{" "}
                {item.other.sku ?? "-"}
              </p>
              <p>
                <span className="font-medium">Serial:</span>{" "}
                {item.other.serial ?? "-"}
              </p>
              <p>
                <span className="font-medium">Current assignee:</span>{" "}
                {item.other.activeUserName ?? "Not assigned"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p>
                <span className="font-medium">Current stock:</span>{" "}
                {item.other.currentStock} {item.other.unitName}
              </p>
              <p>
                <span className="font-medium">Minimum stock:</span>{" "}
                {item.other.minStockLevel} {item.other.unitName}
              </p>
            </div>
          )}

          <div>
            <p className="font-medium">Users</p>
            <ul className="list-disc pl-5">
              {item.users.length === 0 ? (
                <li>No usage yet</li>
              ) : (
                item.users.map((user: { name: string }, index: number) => (
                  <li key={index}>{user.name}</li>
                ))
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
