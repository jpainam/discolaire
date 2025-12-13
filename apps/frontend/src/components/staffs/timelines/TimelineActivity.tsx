"use client";

import { useState } from "react";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";

// Define the structure of an activity
interface Activity {
  id: string;
  type: "delete" | "create" | "edit";
  date: string;
  description: string;
  entityId: string;
  table: string;
}

// Define the props for the ActivityItem component
interface ActivityItemProps {
  activity: Activity;
  onDelete: (id: string) => void;
}

// Helper function to get icon and color based on activity type
const getActivityTypeInfo = (type: Activity["type"]) => {
  switch (type) {
    case "delete":
      return { icon: Trash2, color: "text-red-500" };
    case "create":
      return { icon: PlusCircle, color: "text-green-500" };
    case "edit":
      return { icon: Edit, color: "text-blue-500" };
  }
};

// ActivityItem component to render individual activity items
const ActivityItem = ({ activity, onDelete }: ActivityItemProps) => {
  const { icon: Icon, color } = getActivityTypeInfo(activity.type);

  const t = useTranslations();
  // const dateFormat = Intl.DateTimeFormat(locale, {
  //   year: "numeric",
  //   month: "short",
  //   day: "numeric",
  // });

  return (
    <div className="group hover:bg-muted/50 flex items-center space-x-4 border-b py-2 last:border-b-0">
      <div className={`${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold">{activity.description}</p>
        <p className="text-muted-foreground text-sm">
          {activity.date} | Entity ID: {activity.entityId} | Table:{" "}
          {activity.table}
        </p>
      </div>
      <Button
        variant="destructive"
        size="sm"
        className="h-6 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={() => onDelete(activity.id)}
      >
        {t("delete")}
      </Button>
    </div>
  );
};

// Main component
export function TimelineActivity() {
  // Sample activity data
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      type: "create",
      date: "2023-09-15 10:30 AM",
      description: "Created new user account",
      entityId: "USER123",
      table: "users",
    },
    {
      id: "2",
      type: "edit",
      date: "2023-09-16 2:45 PM",
      description: "Updated product details",
      entityId: "PROD456",
      table: "products",
    },
    {
      id: "3",
      type: "delete",
      date: "2023-09-17 9:15 AM",
      description: "Deleted order",
      entityId: "ORD789",
      table: "orders",
    },
    // Add more activities as needed
  ]);

  // Function to handle activity deletion
  const handleDelete = (id: string) => {
    setActivities(activities.filter((activity) => activity.id !== id));
  };

  return (
    <ScrollArea className="h-[calc(100vh-20rem)]">
      {activities.map((activity) => (
        <ActivityItem
          key={activity.id}
          activity={activity}
          onDelete={handleDelete}
        />
      ))}
    </ScrollArea>
  );
}
