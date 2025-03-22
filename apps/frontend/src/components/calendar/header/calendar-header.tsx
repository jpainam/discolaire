import { Button } from "@repo/ui/components/button";
import { Columns2, Grid3X3, List, PlusIcon } from "lucide-react";

import { DateNavigator } from "~/components/calendar/header/date-navigator";
import { TodayButton } from "~/components/calendar/header/today-button";
import { UserSelect } from "~/components/calendar/header/user-select";

import { ToggleGroup, ToggleGroupItem } from "@repo/ui/components/toggle-group";
import { cn } from "@repo/ui/lib/utils";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import type { IEvent } from "~/components/calendar/interfaces";
import type { TCalendarView } from "~/components/calendar/types";
import { CreateEditLesson } from "~/components/classrooms/timetables/CreateEditLesson";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useCalendar } from "../calendar-context";

interface IProps {
  events: IEvent[];
}
const calendarModeIconMap: Record<"day" | "month" | "week", React.ReactNode> = {
  day: <List />,
  week: <Columns2 />,
  month: <Grid3X3 />,
};

export function CalendarHeader({ events }: IProps) {
  const { view, setView } = useCalendar();
  const { t } = useLocale();
  const { openModal } = useModal();
  return (
    <div className="flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <TodayButton />
        <DateNavigator events={events} />
      </div>

      <div className="flex items-center justify-between gap-1.5">
        <LayoutGroup>
          <ToggleGroup
            className="flex gap-0 -space-x-px rounded-sm border overflow-hidden shadow-sm shadow-black/5 rtl:space-x-reverse"
            type="single"
            variant="outline"
            value={view}
            onValueChange={(value) => {
              if (value) {
                setView(value as TCalendarView);
              }
            }}
          >
            {["day", "week", "month"].map((modeValue) => {
              const isSelected = view === (modeValue as TCalendarView);
              return (
                <motion.div
                  key={modeValue}
                  layout
                  className="flex-1 flex divide-x"
                  animate={{ flex: isSelected ? 1.6 : 1 }}
                  transition={{
                    flex: {
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    },
                  }}
                >
                  <ToggleGroupItem
                    value={modeValue}
                    className={cn(
                      "w-full rounded-none shadow-none focus-visible:z-10 text-base flex items-center justify-center gap-2 relative border-none",
                      isSelected && "z-10",
                    )}
                  >
                    <motion.div
                      layout
                      className="flex items-center justify-center gap-2 py-2 px-3"
                      initial={false}
                      animate={{
                        scale: isSelected ? 1 : 0.95,
                      }}
                      transition={{
                        scale: {
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        },
                        layout: {
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        },
                      }}
                    >
                      <motion.div
                        layout="position"
                        initial={false}
                        animate={{
                          scale: isSelected ? 0.9 : 1,
                        }}
                        transition={{
                          scale: {
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          },
                        }}
                      >
                        {calendarModeIconMap[modeValue as TCalendarView]}
                      </motion.div>
                      <AnimatePresence mode="popLayout">
                        {isSelected && (
                          <motion.p
                            layout="position"
                            key={`text-${modeValue}`}
                            className="font-medium origin-left whitespace-nowrap"
                            initial={{
                              opacity: 0,
                              x: -2,
                              scale: 0.95,
                            }}
                            animate={{
                              opacity: 1,
                              x: 0,
                              scale: 1,
                              transition: {
                                type: "spring",
                                stiffness: 400,
                                damping: 30,
                                opacity: { duration: 0.15 },
                              },
                            }}
                            exit={{
                              opacity: 0,
                              x: -2,
                              scale: 0.95,
                              transition: {
                                type: "spring",
                                stiffness: 400,
                                damping: 30,
                                opacity: { duration: 0.1 },
                              },
                            }}
                          >
                            {modeValue.charAt(0).toUpperCase() +
                              modeValue.slice(1)}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </ToggleGroupItem>
                </motion.div>
              );
            })}
          </ToggleGroup>
        </LayoutGroup>

        <div className="flex items-center gap-1.5">
          <UserSelect />
          <Button
            onClick={() => {
              openModal({
                title: t("create_timetable"),
                view: <CreateEditLesson />,
              });
            }}
            size="sm"
            variant={"default"}
          >
            <PlusIcon />
            {t("add")}
          </Button>
        </div>
      </div>
    </div>
  );
}
