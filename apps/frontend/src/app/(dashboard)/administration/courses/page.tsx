import { CourseAction } from "./CourseAction";
import { CourseTable } from "./CourseTable";

export default function Page() {
  return (
    <div className="flex flex-col gap-2">
      <div className="ml-auto">
        <CourseAction />
      </div>
      <CourseTable />
    </div>
  );
}
