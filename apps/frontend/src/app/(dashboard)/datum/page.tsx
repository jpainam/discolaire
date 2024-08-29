import { redirect } from "next/navigation";

export default function Page() {
  redirect("/datum/students");
  // return (
  //   <div className="flex flex-col gap-2 px-2">
  //     <Suspense fallback={<SearchSkeleton />}>
  //       <DatumSearchHeader />
  //     </Suspense>
  //     <DatumDataTable searchParams={searchParams} />
  //   </div>
  // );
}
