"use client";

import { useLocale } from "@repo/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";

import DocIcon from "~/components/icons/doc-solid";
import FolderIcon from "~/components/icons/folder-solid";
import ImageIcon from "~/components/icons/image-solid";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { cn } from "~/lib/utils";

interface Option {
  value: string;
  name: string;
  icon: React.ReactNode;
  id: number;
}
const fileTypeOptions: Option[] = [
  {
    value: "folder",
    name: "Folder",
    icon: <FolderIcon className="h-6 w-6" />,
    id: 1,
  },
  {
    value: "pdf",
    name: "PDF",
    icon: <PDFIcon className="h-6 w-6" />,
    id: 2,
  },
  {
    value: "doc",
    name: "Doc",
    icon: <DocIcon className="h-6 w-6" />,
    id: 3,
  },
  {
    value: "xml",
    name: "XML",
    icon: <XMLIcon className="h-6 w-6" />,
    id: 4,
  },
  {
    value: "image",
    name: "Image",
    icon: <ImageIcon className="h-6 w-6" />,
    id: 5,
  },
];

export function FileTypeSelector({
  className,
  onChange,
  defaultValue,
}: {
  className?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}) {
  const { t } = useLocale();
  return (
    <Select defaultValue={defaultValue} onValueChange={onChange}>
      <SelectTrigger className={cn("w-[280px]", className)}>
        <SelectValue placeholder={t("select_an_option")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t("all")}</SelectItem>
        {fileTypeOptions.map(
          (item: {
            name: string;
            value: string;
            id: number;
            icon?: React.ReactNode;
          }) => (
            <SelectItem key={item.id} value={item.value}>
              <div className="flex flex-row items-center gap-1">
                <span className="w-[30px]">{item.icon}</span>
                <span>{item.name}</span>
              </div>
            </SelectItem>
          ),
        )}
      </SelectContent>
    </Select>
  );
}
