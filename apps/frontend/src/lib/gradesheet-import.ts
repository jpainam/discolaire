import * as XLSX from "@e965/xlsx";

export interface GradeImportRow {
  studentId: string;
  grade: string;
}

/**
 * Parses an Excel gradesheet file and returns one row per student.
 * Expected format: col 0 = studentId, col 3 = grade, first row is header.
 */
export async function parseGradeSheetExcel(
  file: File,
): Promise<GradeImportRow[]> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error("Aucune feuille trouvée");
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) throw new Error("Feuille excel invalide");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sheetData: any[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    raw: true,
  });

  // skip the header row; col0 = studentId, col3 = grade
  return sheetData.slice(1).reduce<GradeImportRow[]>((acc, row) => {
    const studentId = String(row[0] ?? "").trim();
    const grade = String(row[3] ?? "").trim();
    if (studentId) acc.push({ studentId, grade });
    return acc;
  }, []);
}
