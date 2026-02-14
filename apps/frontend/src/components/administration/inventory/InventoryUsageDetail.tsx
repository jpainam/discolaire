import { format } from "date-fns";
import { Calendar, ClipboardList, Package, User } from "lucide-react";

import type { RouterOutputs } from "@repo/api";

import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";

export function InventoryUsageDetail({
  item,
}: {
  item: RouterOutputs["inventory"]["consumableUsages"][number];
}) {
  return (
    <SheetContent className="overflow-y-auto sm:max-w-md md:max-w-lg">
      <SheetHeader className="pb-4">
        <SheetTitle className="flex items-center gap-2 text-xl">
          <Package className="h-5 w-5" />
          Usage details
        </SheetTitle>
        <SheetDescription>Transaction {item.id}</SheetDescription>
      </SheetHeader>

      <div className="space-y-6 py-4">
        <div>
          <h3 className="text-lg font-semibold">{item.consumable.name}</h3>
          <Badge variant="outline" className="mt-2">
            Withdrawal
          </Badge>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <User className="text-muted-foreground mt-0.5 h-5 w-5" />
            <div>
              <h4 className="font-medium">Assigned to</h4>
              <p>{item.staff ? item.staff.name : "-"}</p>
              <p className="text-muted-foreground text-sm">
                {item.staff ? item.staff.email : "-"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Calendar className="text-muted-foreground mt-0.5 h-5 w-5" />
            <div>
              <h4 className="font-medium">Transaction date</h4>
              <p>{format(item.createdAt, "MMMM d, yyyy")}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Package className="text-muted-foreground mt-0.5 h-5 w-5" />
            <div>
              <h4 className="font-medium">Quantity</h4>
              <p>
                {item.quantity}{" "}
                {item.consumable.unit ? item.consumable.unit.name : ""}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <ClipboardList className="text-muted-foreground mt-0.5 h-5 w-5" />
            <div>
              <h4 className="font-medium">Notes</h4>
              <p className="text-sm">{item.note ?? "-"}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <User className="text-muted-foreground mt-0.5 h-5 w-5" />
            <div>
              <h4 className="font-medium">Recorded by</h4>
              <p>{item.createdBy.name}</p>
              <p className="text-muted-foreground text-sm">{item.createdBy.email}</p>
            </div>
          </div>
        </div>
      </div>
    </SheetContent>
  );
}
