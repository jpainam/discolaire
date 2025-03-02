import { Label } from "@repo/ui/components/label";
import { getServerTranslations } from "~/i18n/server";
import { api } from "~/trpc/server";

export async function StaffEffectif() {
  const staffs = await api.staff.all();
  const females = staffs.filter((staff) => staff.gender == "female").length;
  const total = staffs.length;
  const males = total - females;
  const { t } = await getServerTranslations();
  const COLORS = ["#6741D9", "#E0C6FD", "#FFBC75", "#FF7272"];
  return (
    <div className="flex flex-row items-center gap-4 text-sm">
      <Label>{t("staffs")}</Label>

      <Detail color={COLORS[0]} value={total} text={t("total")} />
      <Detail color={COLORS[2]} value={males} text={t("male")} />
      <Detail color={COLORS[3]} value={females} text={t("female")} />
    </div>
  );
}

function Detail({
  color,
  value,
  text,
}: {
  color?: string;
  value: number;
  text: string;
}) {
  return (
    <div className="flex justify-between gap-2">
      <div className="col-span-3 flex items-center justify-start gap-1.5">
        <span
          style={{ background: color }}
          className="block h-2.5 w-2.5 rounded"
        />
        <p className="text-gray-500">{text}</p>
      </div>
      <span
        style={{ borderColor: color }}
        className="rounded-full border-2 px-2 py-0.5 font-bold text-gray-700"
      >
        {value}
      </span>
    </div>
  );
}
