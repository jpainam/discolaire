import { format } from "date-fns";
import { Calendar, ClipboardList, Clock, Package, User } from "lucide-react";

import type { RouterOutputs } from "@repo/api";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
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
          Item Details
        </SheetTitle>
        <SheetDescription>
          Complete information about inventory transaction {item.id}
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-6 py-4">
        <div>
          <h3 className="text-lg font-semibold">{item.consumable?.name}</h3>
          <Badge variant="outline" className={`mt-2`}>
            {"Returned"}
          </Badge>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <User className="text-muted-foreground mt-0.5 h-5 w-5" />
            <div>
              <h4 className="font-medium">Assigned To</h4>
              <div className="mt-1 flex items-center gap-2">
                {/* <Avatar>
                  <AvatarImage
                    src={item.user.avatar ?? "/placeholder.svg"}
                    alt={item.user.name}
                  />
                  <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                </Avatar> */}
                <div>
                  <p>{item.user.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {item.user.email}
                  </p>
                </div>
              </div>
              <p className="mt-1 text-sm">Department: {item.user.profile}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Calendar className="text-muted-foreground mt-0.5 h-5 w-5" />
            <div>
              <h4 className="font-medium">Transaction Date</h4>
              <p>{format(item.createdAt, "MMMM d, yyyy")}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Package className="text-muted-foreground mt-0.5 h-5 w-5" />
            <div>
              <h4 className="font-medium">Item Details</h4>
              <p>Quantity: {item.quantity}</p>
              <p>Serial Number: {item.id}</p>
              <p>Condition: {"Condition"}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <ClipboardList className="text-muted-foreground mt-0.5 h-5 w-5" />
            <div>
              <h4 className="font-medium">Notes</h4>
              <p className="text-sm">{item.note}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Clock className="text-muted-foreground mt-0.5 h-5 w-5" />
            <div>
              <h4 className="font-medium">Recorded By</h4>
              <div className="mt-1 flex items-center gap-2">
                {/* <Avatar>
                  <AvatarImage
                    src={item.createdBy.avatar ?? "/placeholder.svg"}
                    alt={item.createdBy.name}
                  />
                  <AvatarFallback>
                    {item.createdBy.name.charAt(0)}
                  </AvatarFallback>
                </Avatar> */}
                <div>
                  <p>{item.createdBy.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {item.createdBy.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex justify-end gap-2">
          {item.createdAt.toString() === "checked-out" ? (
            <Button variant="default">Mark as Returned</Button>
          ) : (
            <Button variant="outline">Check Out Again</Button>
          )}
          <Button variant="outline">Edit Details</Button>
        </div>
      </div>
    </SheetContent>
  );
}
