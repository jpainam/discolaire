import type { SearchParams } from "nuqs/server";
import {
  createLoader,
  parseAsIsoDate,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

const attendanceSearchSchema = {
  termId: parseAsString,
  attendanceType: parseAsStringLiteral(["daily", "periodic"]),
  date: parseAsIsoDate.withDefault(new Date()),
};
interface PageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ id: string }>;
}

const attendanceSearchParams = createLoader(attendanceSearchSchema);

export default async function Page(props: PageProps) {
  const searchParams = await attendanceSearchParams(props.searchParams);
  const params = await props.params;
  return <div>List of all attendance</div>;
}
