import { ProgramHeader } from "~/components/programs/ProgramHeader";

export default function Page() {
  return (
    <div className="flex w-full flex-col">
      <ProgramHeader />
      <div className="flex-1 flex-row gap-2"></div>
    </div>
  );
}
