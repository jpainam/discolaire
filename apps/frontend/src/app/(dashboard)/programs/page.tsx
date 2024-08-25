import { ProgramHeader } from "~/components/programs/ProgramHeader";
import { SubjectsList } from "~/components/programs/subjects-list";

export default function Page() {
  return (
    <div className="flex w-full flex-col">
      <ProgramHeader />
      <div className="flex-1 flex-row gap-2">
        <SubjectsList className="h-full w-[250px] border-r" />
      </div>
    </div>
  );
}
