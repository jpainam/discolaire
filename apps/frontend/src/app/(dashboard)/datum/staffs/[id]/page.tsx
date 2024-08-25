import { getServerTranslations } from "@/app/i18n/server";
import { TimelineAction } from "@/components/staffs/timelines/TimelineAction";

import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const staff = await api.staff.get({ id });
  if (!staff) {
    notFound();
  }
  const timelines = await api.staff.timelines(id);
  const { t, i18n } = await getServerTranslations();
  const dateFormat = Intl.DateTimeFormat(i18n.language, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="p-2 flex flex-col">
      {timelines.map((timeline) => {
        return (
          <div
            key={timeline.id}
            className="flex justify-between flex-row rounded-md p-2 group hover:bg-secondary hover:text-secondary-foreground"
          >
            <div className="flex flex-row items-start space-x-2">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <div className="w-px h-16 bg-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {dateFormat.format(timeline.date)}
                </p>
                <p className="text-sm">{timeline.title}</p>
                <p className="text-xs text-muted-foreground">
                  {timeline.description}
                </p>
              </div>
            </div>
            <div className=" justify-end flex opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive">
              <TimelineAction timelineId={timeline.id} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
