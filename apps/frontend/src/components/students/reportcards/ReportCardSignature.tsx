import { getTranslations } from "next-intl/server";

import { CardSignatureCanvas } from "./CardSignatureCanvas";

export async function ReportCardSignature() {
  const t = await getTranslations();
  return (
    <div className="m-2 grid grid-cols-3 divide-x divide-y border text-sm font-bold">
      <div className="bg-muted/50 p-2 text-center">{t("parents")}</div>
      <div className="bg-muted/50 p-2 text-center">{t("head_teacher")}</div>
      <div className="bg-muted/50 p-2 text-center">{t("principal")}</div>
      <div className="col-span-full border-b"></div>
      <div className="h-20">
        <CardSignatureCanvas />
      </div>
      <div></div>
      <div></div>
    </div>
  );
}
