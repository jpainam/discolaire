import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Layout,
  ListTodo,
  PieChart,
  Users,
} from "lucide-react";

export function AssignmentSidebar() {
  const menuItems = [
    { label: "Dashboard", icon: Layout },
    { label: "Assignments", icon: ListTodo },
    { label: "Students", icon: Users },
    { label: "Grades", icon: PieChart },
    { label: "Calendar", icon: CalendarIcon },
  ];
  return (
    <nav className="hidden w-64 flex-col overflow-y-auto border-r bg-muted/50 text-sm shadow-md md:flex">
      <ul className="space-y-2 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.label}>
              <Link
                href="#"
                className="flex w-full flex-row items-center justify-start gap-2 rounded-md p-2 hover:bg-secondary"
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
