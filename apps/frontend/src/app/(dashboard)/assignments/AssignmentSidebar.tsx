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
    <nav className="bg-muted/50 hidden w-64 flex-col overflow-y-auto border-r text-sm shadow-md md:flex">
      <ul className="space-y-2 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.label}>
              <Link
                href="#"
                className="hover:bg-secondary flex w-full flex-row items-center justify-start gap-2 rounded-md p-2"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
