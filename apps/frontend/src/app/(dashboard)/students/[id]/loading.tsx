import { Skeleton } from "~/components/ui/skeleton";

function StudentDetailsSkeleton() {
  const valueWidths = ["w-28", "w-36", "w-32", "w-40", "w-24", "w-44"];

  return (
    <div className="col-span-full flex flex-col py-2 lg:col-span-3">
      {Array.from({ length: 3 }).map((_, sectionIndex) => (
        <div key={`section-${sectionIndex}`} className="space-y-4 px-4 py-2">
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 xl:grid-cols-4">
            {valueWidths.map((width, rowIndex) => (
              <div key={`row-${sectionIndex}-${rowIndex}`} className="contents">
                <Skeleton className="h-4 w-24" />
                <Skeleton className={`h-4 ${width}`} />
              </div>
            ))}
          </div>
          {sectionIndex < 2 && <div className="border-border border-b" />}
        </div>
      ))}
    </div>
  );
}

function StudentGradeCountSkeleton() {
  return (
    <div className="col-span-2 px-2 py-2">
      <div className="space-y-4">
        <Skeleton className="h-9 w-full" />

        {Array.from({ length: 5 }).map((_, index) => (
          <div key={`grade-count-${index}`} className="flex items-center gap-3">
            <Skeleton className="size-3 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="ml-auto h-2 w-24" />
            <Skeleton className="h-4 w-6" />
          </div>
        ))}

        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={`metric-${index}`} className="rounded-lg border p-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="mt-2 h-6 w-14" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentAttendanceSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 p-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={`attendance-${index}`} className="rounded-xl border p-4">
          <Skeleton className="h-7 w-10" />
          <Skeleton className="mt-2 h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

function StudentContactsSkeleton() {
  return (
    <div className="border-b">
      <div className="bg-muted/50 grid grid-cols-[1fr,220px,32px] gap-3 px-4 py-3">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-5" />
      </div>
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3">
        <Skeleton className="size-9 rounded-full" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-5 w-5" />
      </div>
    </div>
  );
}

function StudentGradesheetSkeleton() {
  return (
    <div className="overflow-hidden">
      <div className="bg-muted/50 grid grid-cols-6 gap-3 px-4 py-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={`header-${index}`} className="h-5 w-full" />
        ))}
      </div>
      <div className="space-y-3 px-4 py-3">
        {Array.from({ length: 9 }).map((_, rowIndex) => (
          <div key={`grade-row-${rowIndex}`} className="grid grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, colIndex) => (
              <Skeleton
                key={`grade-cell-${rowIndex}-${colIndex}`}
                className="h-5 w-full"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function StudentChartSkeleton() {
  return (
    <div className="p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Skeleton className="h-9 w-56" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <Skeleton className="h-[350px] w-full" />
    </div>
  );
}

export default function Loading() {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 divide-x border-b lg:grid-cols-6">
        <StudentDetailsSkeleton />
        <StudentGradeCountSkeleton />
        <StudentAttendanceSkeleton />
      </div>

      <div className="divide-border grid divide-y lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        <div className="flex flex-col gap-2">
          <StudentContactsSkeleton />
          <StudentGradesheetSkeleton />
        </div>
        <StudentChartSkeleton />
      </div>
    </div>
  );
}
