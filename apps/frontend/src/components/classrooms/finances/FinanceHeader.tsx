"use client";

import { useAtomValue } from "jotai";
import { CreditCardIcon, MoreVertical, WalletIcon } from "lucide-react";
import { useQueryState } from "nuqs";
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

import { useParams } from "next/navigation";
import { selectedStudentIdsAtom } from "~/atoms/transactions";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { useModal } from "~/hooks/use-modal";
import { sidebarIcons } from "../sidebar-icons";
import { FinanceBulkAction } from "./FinanceBulkAction";
import { SelectDueDate } from "./SelectDueDay";

export function FinanceHeader() {
  const { t } = useLocale();
  const params = useParams<{ id: string }>();
  //const { createQueryString } = useCreateQueryString();
  const [type, setType] = useQueryState("type");
  const [search, setSearch] = useQueryState("query");
  const { openModal } = useModal();

  const selectedStudents = useAtomValue(selectedStudentIdsAtom);
  const Icon = sidebarIcons.financial_situation;
  const ids = selectedStudents.join(",");
  return (
    <div className="flex flex-row items-center gap-2 border-b  px-4 py-1 ">
      {Icon && <Icon className="h-6 w-6" />}
      <Label>{t("financial_situation")}</Label>
      <Input
        onChange={(v) => setSearch(v.target.value, { shallow: false })}
        className="w-64"
        defaultValue={search ?? ""}
        placeholder={t("search")}
      />
      <ToggleGroup
        type="single"
        size="sm"
        onValueChange={(val) => {
          void setType(val == "all" ? null : val);
        }}
        variant={"outline"}
        defaultValue={type ?? "all"}
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
        <ChangeFinanceView />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <FinanceBulkAction />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <PDFIcon className="h-4 w-4" />
                <span className="px-2">{t("pdf_export")}</span>
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
                <XMLIcon className="h-4 w-4" />
                <span className="px-2">{t("xml_export")}</span>
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
                  {/* <DropdownMenuItem
                    onSelect={() => {
                      openModal({
                        title: t("due_date"),
                        view: (
                          <SelectDueDate
                            format="csv"
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
                  </DropdownMenuItem> */}
                  {/* <DropdownMenuItem
                    onSelect={() => {
                      window.open(
                        `/api/pdfs/classroom/${params.id}/finances?format=csv&type=selected`,
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function ChangeFinanceView() {
  const [view, setView] = useQueryState("view");

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
  return (
    <ToggleGroup
      size={"sm"}
      defaultValue={view ?? "list"}
      onValueChange={(val) => {
        void setView(val);
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
  );
}
