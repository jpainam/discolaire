import { notFound } from "next/navigation";

import { getServerTranslations } from "@repo/i18n/server";

import { TimelineAction } from "~/components/staffs/timelines/TimelineAction";
import { api } from "~/trpc/server";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const staff = await api.staff.get(id);
  if (!staff) {
    notFound();
  }
  const timelines = await api.staff.timelines(id);
  const { i18n } = await getServerTranslations();
  const dateFormat = Intl.DateTimeFormat(i18n.language, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex flex-col p-2">
      {timelines.map((timeline) => {
        return (
          <div
            key={timeline.id}
            className="group flex flex-row justify-between rounded-md p-2 hover:bg-secondary hover:text-secondary-foreground"
          >
            <div className="flex flex-row items-start space-x-2">
              <div className="flex flex-col items-center">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <div className="h-16 w-px bg-primary" />
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
            <div className="flex justify-end text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100">
              <TimelineAction timelineId={timeline.id} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
