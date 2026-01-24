import {
  ClipboardPlus,
  FileText,
  MessageSquarePlus,
  UserCheck,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

const actions = [
  {
    name: "New Assignment",
    description: "Create homework or quiz",
    icon: ClipboardPlus,
    color: "text-chart-1",
  },
  {
    name: "Take Attendance",
    description: "Record class attendance",
    icon: UserCheck,
    color: "text-chart-2",
  },
  {
    name: "Grade Work",
    description: "Review submissions",
    icon: FileText,
    color: "text-chart-3",
  },
  {
    name: "Send Message",
    description: "Contact students or parents",
    icon: MessageSquarePlus,
    color: "text-chart-4",
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.name}
              variant="outline"
              className="hover:bg-muted/50 h-auto flex-col items-start gap-2 bg-transparent p-4 text-left"
            >
              <action.icon className={`h-5 w-5 ${action.color}`} />
              <div>
                <p className="text-sm font-medium">{action.name}</p>
                <p className="text-muted-foreground text-xs font-normal">
                  {action.description}
                </p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
