import { ProgramHeader } from "@/components/programs/ProgramHeader";
import { SubjectsList } from "@/components/programs/subjects-list";

export default function Page() {
  return (
    <div className="flex flex-col w-full">
      <ProgramHeader />
      <div className="flex-1 flex-row gap-2">
        <SubjectsList className="w-[250px] border-r h-full" />
      </div>
    </div>
  );
}
