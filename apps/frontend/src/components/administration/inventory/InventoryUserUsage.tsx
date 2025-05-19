"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
export function InventoryUserUsage() {
  const trpc = useTRPC();
  //const {data: usages} =  useSuspenseQuery(trpc.inventory.getUserUsage.);
  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Teacher Assignments</CardTitle>
        <CardDescription>Items assigned to teachers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-full">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Ms. Johnson</div>
                <div className="text-sm text-muted-foreground">12 items</div>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: "28%" }}
                ></div>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-full">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Mr. Smith</div>
                <div className="text-sm text-muted-foreground">9 items</div>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: "21%" }}
                ></div>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-full">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Ms. Davis</div>
                <div className="text-sm text-muted-foreground">15 items</div>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: "35%" }}
                ></div>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-full">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Mr. Wilson</div>
                <div className="text-sm text-muted-foreground">7 items</div>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: "16%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
