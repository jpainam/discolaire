"use client";

import { useRef, useState } from "react";
import JSZip from "jszip";
import { Filter, Search, UploadIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsIsoDate, parseAsString, useQueryState } from "nuqs";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import { DateRangePicker } from "~/components/DateRangePicker";
import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { Button } from "~/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { Label } from "~/components/ui/label";
import { Spinner } from "~/components/ui/spinner";
import { useModal } from "~/hooks/use-modal";
import { PhotoListUploader } from "./PhotoListUploader";

const isZip = (f: File) => /\.zip$/i.test(f.name);

const isImagePath = (name: string) =>
  /\.(jpg|jpeg|png|gif|bmp|webp|tiff|svg)$/i.test(name);

export function PhotoListHeader({
  showClassroomFilter = true,
  entityType,
}: {
  showClassroomFilter?: boolean;
  entityType: "student" | "staff" | "contact";
}) {
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [_, setSearchQuery] = useQueryState("q", parseAsString.withDefault(""));
  const [classroomId, setClassroomId] = useQueryState(
    "classroomId",
    parseAsString.withDefault(""),
  );
  const [dateFrom, setDateFrom] = useQueryState("dateFrom", parseAsIsoDate);
  const [dateTo, setDateTo] = useQueryState("dateTo", parseAsIsoDate);

  const debounced = useDebouncedCallback((value: string) => {
    void setSearchQuery(value);
  }, 1000);
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);

  const { openModal } = useModal();

  const handleSelected = async (file: File) => {
    setIsExtracting(true);

    try {
      if (!isZip(file)) {
        setIsExtracting(false);
        openModal({
          className: "sm:max-w-xl",
          view: <PhotoListUploader initialFiles={[file]} entityType={entityType} />,
        });
        return;
      }

      const zip = await JSZip.loadAsync(file);

      const entries = Object.values(zip.files).filter((zf) => !zf.dir);

      const extracted = await Promise.all(
        entries.map(async (zf) => {
          const filename = zf.name.replace(/^\/+/, "");
          if (!isImagePath(filename)) return null;

          const blob = await zf.async("blob");

          return new File([blob], filename, {
            type: blob.type || "application/octet-stream",
            lastModified: Date.now(),
          });
        }),
      );

      const files = extracted.filter((f): f is File => f !== null);
      setIsExtracting(false);

      if (files.length === 0) {
        toast.error(t("No supported images found in ZIP"), { id: 0 });
        return;
      }

      openModal({
        className: "sm:max-w-xl",
        view: <PhotoListUploader initialFiles={files} entityType={entityType} />,
      });
    } catch (err) {
      toast.error((err as Error).message, { id: 0 });
      setIsExtracting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 px-4 py-2">
      <div className="flex items-center gap-2">
        <Filter className="text-muted-foreground h-4 w-4" />
        <Label className="text-sm font-semibold">Filters</Label>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <InputGroup>
          <InputGroupInput
            onChange={(e) => debounced(e.target.value)}
            placeholder={t("search")}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>

        {showClassroomFilter && (
          <ClassroomSelector
            defaultValue={classroomId || undefined}
            onSelect={(id) => void setClassroomId(id)}
          />
        )}

        <DateRangePicker
          defaultValue={
            dateFrom ? { from: dateFrom, to: dateTo ?? undefined } : undefined
          }
          onSelectAction={(range) => {
            void setDateFrom(range?.from ?? null);
            void setDateTo(range?.to ?? null);
          }}
        />

        <div>
          <input
            ref={inputRef}
            type="file"
            accept="application/zip,image/jpeg,image/png"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleSelected(file);
            }}
          />
          <Button
            onClick={() => inputRef.current?.click()}
            disabled={isExtracting}
            variant={"outline"}
          >
            {isExtracting ? <Spinner /> : <UploadIcon />}
            {t("upload")}
          </Button>
        </div>
      </div>
    </div>
  );
}
