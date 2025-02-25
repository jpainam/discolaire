import type { PropsWithChildren } from "react";

import { ClassroomHeader } from "~/components/administration/classrooms/ClassroomHeader";
import { ClassroomTabMenu } from "./ClassroomTabMenu";

export default function Layout({ children }: PropsWithChildren) {
  //const { t } = await getServerTranslations();
  return (
    <div className="flex flex-col gap-2">
      <div className="ml-auto flex flex-row items-center justify-end gap-4">
        <ClassroomTabMenu />
        <ClassroomHeader />
      </div>
      {children}
    </div>
  );
}
