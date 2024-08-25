import AdminClassroomTable from "@/components/administration/classrooms/tab-content";

export default function AdminClassroomPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col px-2">
        <AdminClassroomTable />
      </div>
    </div>
  );
}
