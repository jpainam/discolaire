export function fetchTranscriptClassroomColumns() {
  return [
    { field: "subject" },
    {
      headerName: "Moyennes",
      children: [{ field: "eleve" }, { field: "classe" }],
    },
    { field: "program", headerName: "Programme" },
    { headerName: "App. A: Travail" },
    { headerName: "App. B: Avis Global" },
  ];
}
