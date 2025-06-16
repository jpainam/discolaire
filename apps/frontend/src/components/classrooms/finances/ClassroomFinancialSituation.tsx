/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";

import { useAtomValue } from "jotai";
import {
  CreditCardIcon,
  HandCoins,
  MoreVertical,
  WalletIcon,
} from "lucide-react";
import { FaHandHoldingUsd } from "react-icons/fa";
import { PiGridFour, PiListBullets } from "react-icons/pi";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { ToggleGroup, ToggleGroupItem } from "@repo/ui/components/toggle-group";
import { useLocale } from "~/i18n";

import type { RouterOutputs } from "@repo/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { selectedStudentIdsAtom } from "~/atoms/transactions";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { useModal } from "~/hooks/use-modal";
import { FinanceBulkAction } from "./FinanceBulkAction";
import { GridViewFinanceCard } from "./GridViewFinanceCard";
import { ListViewFinance } from "./ListViewFinance";
import { SelectDueDate } from "./SelectDueDay";

export function ClassroomFinancialSituation({
  balances,
  amountDue,
}: {
  balances: RouterOutputs["classroom"]["studentsBalance"];
  amountDue: number;
}) {
  const { t } = useLocale();
  const params = useParams<{ id: string }>();
  const [type, setType] = useState<string>("all");
  const [query, setQuery] = useState<string>("");
  const { openModal } = useModal();

  const selectedStudents = useAtomValue(selectedStudentIdsAtom);

  const ids = selectedStudents.join(",");

  const [view, setView] = useState<string>("grid");

  const [filteredBalances, setFilteredBalances] = useState(balances);
  const [debouncedQuery] = useDebounce(query, 500);

  const options = [
    {
      value: "list",
      label: <PiListBullets className="h-6 w-6" />,
    },
    {
      value: "grid",
      label: <PiGridFour className="h-6 w-6" />,
    },
  ];

  useEffect(() => {
    if (!debouncedQuery) return setFilteredBalances(balances);

    const qq = debouncedQuery.toLowerCase();
    const filtered = balances.filter((balance) => {
      const { firstName, lastName } = balance.student;
      return (
        firstName?.toLowerCase().includes(qq) ||
        lastName?.toLowerCase().includes(qq) ||
        // user?.email?.toLowerCase().includes(qq) ||
        (!isNaN(Number(qq)) && balance.balance >= Number(qq))
      );
    });

    setFilteredBalances(filtered);
  }, [debouncedQuery, balances]);

  return (
    <div>
      <div className="grid grid-cols-1 md:flex flex-row items-center gap-2 border-b  px-4 py-1 ">
        <HandCoins className="h-4 w-4 " />
        <Label>{t("financial_situation")}</Label>
        <Input
          onChange={(v) => setQuery(v.target.value)}
          className="w-full md:w-64"
          defaultValue={query}
          placeholder={t("search")}
        />
        <ToggleGroup
          type="single"
          size="sm"
          onValueChange={(val) => {
            setType(val);
          }}
          variant={"outline"}
          defaultValue={"all"}
          className="*:data-[slot=toggle-group-item]:px-3 rounded-sm"
        >
          <ToggleGroupItem value="all" aria-label="All">
            <WalletIcon /> {t("all")}
          </ToggleGroupItem>
          <ToggleGroupItem value="debit" aria-label="Debit">
            <CreditCardIcon /> {t("debit")}
          </ToggleGroupItem>
          <ToggleGroupItem value="credit" aria-label="Credit">
            <FaHandHoldingUsd /> {t("credit")}
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="ml-auto flex items-center gap-1">
          <ToggleGroup
            size={"sm"}
            defaultValue={view}
            onValueChange={(val) => {
              setView(val);
            }}
            className="*:data-[slot=toggle-group-item]:px-3 rounded-sm"
            variant={"outline"}
            type="single"
          >
            {options.map((option) => (
              <ToggleGroupItem key={option.value} value={option.value}>
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="size-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <FinanceBulkAction />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <PDFIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{t("pdf_export")}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onSelect={() => {
                        window.open(
                          `/api/pdfs/classroom/${params.id}/finances?format=pdf&type=all&ids=${ids}`,
                          "_blank",
                        );
                      }}
                    >
                      <span>
                        {" "}
                        {t("financial_situation")}{" "}
                        {selectedStudents.length > 0
                          ? `(${selectedStudents.length})`
                          : null}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => {
                        window.open(
                          `/api/pdfs/classroom/${params.id}/finances?format=pdf&type=debit&ids=${ids}`,
                          "_blank",
                        );
                      }}
                    >
                      <span>
                        {t("theDebtorList")}{" "}
                        {selectedStudents.length > 0
                          ? `(${selectedStudents.length})`
                          : null}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => {
                        window.open(
                          `/api/pdfs/classroom/${params.id}/finances?format=pdf&type=credit&ids=${ids}`,
                          "_blank",
                        );
                      }}
                    >
                      <span>
                        {t("theCreditorList")}{" "}
                        {selectedStudents.length > 0
                          ? `(${selectedStudents.length})`
                          : null}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => {
                        openModal({
                          title: t("due_date"),
                          view: (
                            <SelectDueDate
                              format="pdf"
                              classroomId={params.id}
                              ids={ids}
                            />
                          ),
                        });
                      }}
                    >
                      <span>
                        {" "}
                        {t("reminder_letter")}{" "}
                        {selectedStudents.length > 0
                          ? `(${selectedStudents.length})`
                          : null}
                      </span>
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem
                    onSelect={() => {
                      window.open(
                        `/api/pdfs/classroom/${params.id}/finances?format=pdf&type=selected`,
                        "_blank"
                      );
                    }}
                    disabled={selectedStudents.length == 0}
                  >
                    {t("currentSelection")} ({selectedStudents.length})
                  </DropdownMenuItem> */}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <XMLIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{t("xml_export")}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onSelect={() => {
                        window.open(
                          `/api/pdfs/classroom/${params.id}/finances?format=csv&type=all&ids=${ids}`,
                          "_blank",
                        );
                      }}
                    >
                      <span>
                        {t("financial_situation")}{" "}
                        {selectedStudents.length > 0
                          ? `(${selectedStudents.length})`
                          : null}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => {
                        window.open(
                          `/api/pdfs/classroom/${params.id}/finances?format=csv&type=debit&ids=${ids}`,
                          "_blank",
                        );
                      }}
                    >
                      <span>
                        {t("theDebtorList")}{" "}
                        {selectedStudents.length > 0
                          ? `(${selectedStudents.length})`
                          : null}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => {
                        window.open(
                          `/api/pdfs/classroom/${params.id}/finances?format=csv&type=credit&ids=${ids}`,
                          "_blank",
                        );
                      }}
                    >
                      <span>
                        {t("theCreditorList")}{" "}
                        {selectedStudents.length > 0
                          ? `(${selectedStudents.length})`
                          : null}
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {view === "list" ? (
        <ListViewFinance
          type={type}
          amountDue={amountDue}
          students={filteredBalances}
        />
      ) : (
        <div className="grid gap-4 p-2 text-sm md:grid-cols-2 xl:md:grid-cols-3">
          {filteredBalances.map((balance) => {
            return (
              <GridViewFinanceCard
                type={type}
                amountDue={amountDue}
                studentBalance={balance}
                key={balance.id}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
