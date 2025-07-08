import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@repo/ui/components/timeline";
import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const activities = await caller.logActivity.user(params.id);
  const { i18n } = await getServerTranslations();
  if (activities.length === 0) {
    return (
      <div className="flex justify-center items-center h-[50%]">
        The user has activities/timelines yet
      </div>
    );
  }
  return (
    <Timeline defaultValue={3}>
      {activities.map((item) => (
        <TimelineItem
          key={item.id}
          step={item.id}
          className="group-data-[orientation=vertical]/timeline:sm:ms-32"
        >
          <TimelineHeader>
            <TimelineSeparator />
            <TimelineDate className="group-data-[orientation=vertical]/timeline:sm:absolute group-data-[orientation=vertical]/timeline:sm:-left-32 group-data-[orientation=vertical]/timeline:sm:w-20 group-data-[orientation=vertical]/timeline:sm:text-right">
              {item.createdAt.toLocaleDateString(i18n.language, {
                year: "numeric",
                month: "short",
                day: "2-digit",
              })}
            </TimelineDate>
            <TimelineTitle className="sm:-mt-0.5">{item.action}</TimelineTitle>
            <TimelineIndicator />
          </TimelineHeader>
          <TimelineContent>
            {JSON.stringify(item.metadata, null, 2)}
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
