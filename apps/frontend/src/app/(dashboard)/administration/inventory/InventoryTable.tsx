"use client";

import * as React from "react";
import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FilePlus, Search } from "lucide-react";
import { useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";

import { CreateEditStockInEvent } from "~/components/administration/inventory/movements/CreateEditStockInEvent";
import FlatBadge from "~/components/FlatBadge";
import { Button } from "~/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useModal } from "~/hooks/use-modal";
import { PlusIcon } from "~/icons";
import { useTRPC } from "~/trpc/react";
import { CreateEditInventoryItem } from "./CreateEditInventoryItem";
import { ActionCell, AvatarGroup4 } from "./InventoryDataTableColumn";

export function InventoryTable() {
  const t = useTranslations();
  const trpc = useTRPC();
  const { data: inventory } = useSuspenseQuery(
    trpc.inventory.all.queryOptions(),
  );
  const [query, setQuery] = React.useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const { openModal } = useModal();

  const filteredInventory = React.useMemo(() => {
    if (!normalizedQuery) {
      return inventory;
    }

    return inventory.filter((item) => {
      const searchableFields = [
        item.name,
        item.note,
        item.type === "ASSET" ? item.other.sku : "",
        item.type === "ASSET" ? item.other.serial : "",
        item.type === "CONSUMABLE" ? item.other.unitName : "",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableFields.includes(normalizedQuery);
    });
  }, [inventory, normalizedQuery]);

  return (
    <div className="space-y-2">
      <div className="flex flex-row items-center gap-2">
        <InputGroup className="lg:w-1/3">
          <InputGroupInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("search")}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            {filteredInventory.length} results
          </InputGroupAddon>
        </InputGroup>
        <div className="ml-auto flex flex-row items-center gap-2">
          <Button
            onClick={() => {
              openModal({
                title: t("Stock addition"),
                className: "sm:max-w-xl",
                view: <CreateEditStockInEvent />,
              });
            }}
            variant="outline"
          >
            <FilePlus />
            {t("Stock addition")}
          </Button>
          <Button
            onClick={() => {
              openModal({
                title: "Create inventory item",
                className: "sm:max-w-xl",
                view: <CreateEditInventoryItem />,
              });
            }}
            variant={"default"}
          >
            <PlusIcon />
            {"Create item"}
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("description")}</TableHead>
              <TableHead>{t("users")}</TableHead>
              <TableHead>{t("observation")}</TableHead>
              <TableHead className="w-12 text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-muted-foreground py-6 text-center"
                >
                  No inventory item found.
                </TableCell>
              </TableRow>
            ) : (
              filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Link
                      className="line-clamp-1 hover:text-blue-600 hover:underline"
                      href={`/administration/inventory/${item.id}`}
                    >
                      {item.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-[320px] whitespace-normal">
                    {item.note ?? "-"}
                  </TableCell>
                  <TableCell>
                    {item.users.length > 0 ? (
                      <AvatarGroup4 users={item.users} />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <InventoryObservation item={item} />
                  </TableCell>
                  <TableCell className="text-right">
                    <ActionCell inventory={item} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function InventoryObservation({
  item,
}: {
  item: RouterOutputs["inventory"]["all"][number];
}) {
  const t = useTranslations();

  if (item.type === "ASSET") {
    const sku = item.other.sku;
    const serial = item.other.serial;

    return (
      <div className="flex flex-wrap items-center gap-2">
        {sku && (
          <FlatBadge variant="blue">
            {t("Sku")}: {sku}
          </FlatBadge>
        )}
        {serial && (
          <FlatBadge variant="red">
            {t("Serial number")}: {serial}
          </FlatBadge>
        )}
        {!sku && !serial && <span className="text-muted-foreground">-</span>}
      </div>
    );
  }

  const currentStock = item.other.currentStock;
  const minStockLevel = item.other.minStockLevel;
  const unit = item.other.unitName;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <FlatBadge variant="green">
        {t("Current stock")}: {currentStock} {unit}
      </FlatBadge>
      <FlatBadge variant="yellow">
        {t("Min level")}: {minStockLevel} {unit}
      </FlatBadge>
    </div>
  );
}
