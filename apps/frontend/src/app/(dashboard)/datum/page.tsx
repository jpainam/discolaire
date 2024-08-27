import { redirect } from "next/navigation";

type SearchParams = Record<string, string | string[]>;

export default function Page({ searchParams }: { searchParams: SearchParams }) {
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
