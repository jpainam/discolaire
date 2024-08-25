import { ColDef, ColGroupDef } from "@ag-grid-community/core";
import { TFunction } from "i18next";

export function fetchTranscriptColumns({
  t,
}: {
  t: TFunction<string, unknown>;
}): (ColDef | ColGroupDef)[] {
  return [
    {
      field: "subject",
      headerName: t("subject"),
    },
    {
      headerName: "Moyennes",
      children: [
        { field: "classe" },
        { field: "maxMoy", headerName: "Max" },
        { field: "minMoy", headerName: "Min" },
      ],
    },
    { field: "program", headerName: "Programme" },
    { field: "appreciation", headerName: "Appréciation" },
  ];
}
