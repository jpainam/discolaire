"use client";

type SubjectListProps = {
  className?: string;
};
export function SubjectsList({ className }: SubjectListProps) {
  return <div></div>;
  // const classroomId = useAtomValue(classroomIdAtom);
  // const { data: subjects } = (classroomId ?? "");
  // return (
  //   <div className={cn(className)}>
  //     {subjects?.map((subj) => {
  //       return (
  //         <div key={subj.id} className="p-2 bg-gray-100 rounded-lg">
  //           {subj.course?.shortName}
  //         </div>
  //       );
  //     })}
  //   </div>
  //);
}
