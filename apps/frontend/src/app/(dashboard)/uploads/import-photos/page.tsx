import { getServerTranslations } from "@/app/i18n/server";
import { Button } from "@repo/ui/button";
import { Label } from "@repo/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";

export default async function ImportPhotosPage() {
  const { t } = await getServerTranslations();
  return (
    <div className="flex max-w-md flex-col gap-4">
      <div className="text-md font-bold">{t("import_photos")}</div>
      <div className="grid grid-cols-1 gap-4 rounded-sm border md:grid-cols-2">
        <Label>{t("group")}</Label>
        <Select>
          <SelectTrigger>
            <SelectValue>Choose a group</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Eleves</SelectItem>
            <SelectItem value="2">Staff</SelectItem>
          </SelectContent>
        </Select>
        <Label>Zip File (Maximum size allowed 100MB)</Label>
        <input
          type="file"
          className="rounded-sm border"
          accept=".zip"
          multiple
        />
        <Label>{t("mapping_file")}</Label>
        <input
          type="file"
          className="rounded-sm border"
          accept=".csv"
          multiple
        />
        <Label>{t("mapping_type")}</Label>
        <Select>
          <SelectTrigger>
            <SelectValue>Choose a type</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Student Matric / File</SelectItem>
            <SelectItem value="2">Student first name / File</SelectItem>
            <SelectItem value="3">Student last name / File</SelectItem>
          </SelectContent>
        </Select>
        <Button>{t("valider")}</Button>
      </div>
    </div>
  );
}
