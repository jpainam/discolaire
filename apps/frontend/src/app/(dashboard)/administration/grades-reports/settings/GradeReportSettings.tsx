export function GradeReportSettings() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row gap-2">
        <div>Bulletin de notes</div>

        <div>Select Periode(trimestre, sequence, annuelle)</div>
        <div>Selection students</div>
        <div>
          Sera publié après le conseil de classe ou le 29/08/2024 à défault
        </div>
        <div>A été publié le 23/11/2023</div>
      </div>
      <div>
        Statistique: Moyenne: Generale, % reussite (nbreussite/nbecheck){" "}
      </div>
      <div>Conseil de classe</div>
    </div>
  );
}
