import { DashboardClassroomSize } from "@/components/dashboard/DashboardClassroomSize";
import { DashboardTransactionTrend } from "@/components/dashboard/DashboardTransactionTrend";
import { EffectiveStat } from "@/components/dashboard/EffectiveStat";
import { SearchBlock } from "@/components/dashboard/SearchBlock";
import Link from "next/link";
import { Suspense } from "react";

export default async function DashboardPage() {
  // const signedUrl = await fetch(
  //   "http://localhost:3000/api/upload?key=avatars/011ece07-f378-47de-bbe5-d1cb8618dd8e"
  // );
  // console.log(signedUrl);
  // const data = await signedUrl.json();
  // const grades = await reportCardService.getGrades(
  //   "2b030158-4304-4dba-a6be-b99c5c6c26b9",
  //   43
  // );

  return (
    <div className="grid px-6 md:px-8 2xl:px-10 md:mt-4 gap-4 grid-cols-12">
      <div className="col-span-full text-lg md:text-2xl font-bold">
        Dashboard
        <Link target="_blank" href={"#"}>
          The link
        </Link>
      </div>
      <SearchBlock className="col-span-full md:col-span-6" />
      <Suspense>
        <EffectiveStat className="col-span-full" />
      </Suspense>

      {/* <Suspense>
        <TransactionStat className="col-span-full" />
      </Suspense> */}
      <DashboardClassroomSize className="col-span-full" />
      <DashboardTransactionTrend className="col-span-full" />
      {/*
        <ClassroomEffectiveStats className="text-sm col-span-8" />
        <GenderStats className="col-span-4" /> */}
    </div>
  );
}
{
  /* <div className="grid grid-cols-12 gap-6 @container @[59rem]:gap-7">
      <JobStats className="col-span-full" /> */
}
