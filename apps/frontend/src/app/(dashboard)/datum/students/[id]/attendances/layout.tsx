import { AttendanceHeader } from "~/components/students/attendances/AttendanceHeader";

export default function Layout(props: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { children } = props;

  return (
    <div className="flex flex-col">
      <AttendanceHeader />
      {children}
    </div>
  );
}
