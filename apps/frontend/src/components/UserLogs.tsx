"use client";

import { useState } from "react";
import { ChevronDown, FileEdit, Filter, Plus, Trash, X } from "lucide-react";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";

import { useLocale } from "~/i18n";

// Sample activity data
const activityData = [
  {
    id: 1,
    user: "John Doe",
    action: "delete",
    item: "Transaction #4392",
    timestamp: "2023-04-15 09:23:45",
  },
  {
    id: 2,
    user: "Jane Smith",
    action: "create",
    item: "Transaction #4393",
    timestamp: "2023-04-15 10:15:22",
  },
  {
    id: 3,
    user: "Mike Johnson",
    action: "edit",
    item: "Transaction #4391",
    timestamp: "2023-04-15 11:05:37",
  },
  {
    id: 4,
    user: "Sarah Williams",
    action: "create",
    item: "Transaction #4394",
    timestamp: "2023-04-15 13:45:12",
  },
  {
    id: 5,
    user: "John Doe",
    action: "edit",
    item: "Transaction #4390",
    timestamp: "2023-04-15 14:30:55",
  },
  {
    id: 6,
    user: "Jane Smith",
    action: "delete",
    item: "Transaction #4389",
    timestamp: "2023-04-15 15:20:18",
  },
  {
    id: 7,
    user: "Mike Johnson",
    action: "create",
    item: "Transaction #4395",
    timestamp: "2023-04-15 16:10:42",
  },
  {
    id: 8,
    user: "Sarah Williams",
    action: "edit",
    item: "Transaction #4393",
    timestamp: "2023-04-15 16:55:33",
  },
  {
    id: 9,
    user: "John Doe",
    action: "create",
    item: "Transaction #4396",
    timestamp: "2023-04-16 09:15:27",
  },
  {
    id: 10,
    user: "Jane Smith",
    action: "edit",
    item: "Transaction #4395",
    timestamp: "2023-04-16 10:05:19",
  },
];

// Get unique users from data
const users = [...new Set(activityData.map((item) => item.user))];

// Action types with their corresponding icons and colors
const actionTypes = {
  create: {
    icon: Plus,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  edit: {
    icon: FileEdit,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  delete: {
    icon: Trash,
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
};

export function UserLog() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedActions, setSelectedActions] = useState<string[]>(
    Object.keys(actionTypes),
  );

  // Filter activities based on selected filters
  const filteredActivities = activityData.filter((activity) => {
    const userMatch = !selectedUser || activity.user === selectedUser;
    const actionMatch = selectedActions.includes(activity.action);
    return userMatch && actionMatch;
  });

  // Toggle action selection
  const toggleAction = (action: string) => {
    if (selectedActions.includes(action)) {
      setSelectedActions(selectedActions.filter((a) => a !== action));
    } else {
      setSelectedActions([...selectedActions, action]);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedUser(null);
    setSelectedActions(Object.keys(actionTypes));
  };

  // Get action icon component
  const getActionIcon = (action: string) => {
    const ActionIcon = actionTypes[action as keyof typeof actionTypes].icon;
    return <ActionIcon className="h-4 w-4" />;
  };
  const { t } = useLocale();

  return (
    <div className="flex flex-col space-y-4">
      {/* Filters section */}

      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-xs">{t("filter")}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="ml-auto h-8 px-2 text-xs"
          >
            Reset
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Select
            value={selectedUser ?? ""}
            onValueChange={(value) => setSelectedUser(value || null)}
          >
            <SelectTrigger size="sm" className="h-8 w-full">
              <SelectValue placeholder="Filter by user" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All users</SelectItem>
              {users.map((user) => (
                <SelectItem key={user} value={user}>
                  {user}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Action type filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="justify-between gap-1"
              >
                <span>Action types</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {Object.entries(actionTypes).map(([action, { icon: Icon }]) => (
                <DropdownMenuCheckboxItem
                  key={action}
                  checked={selectedActions.includes(action)}
                  onCheckedChange={() => toggleAction(action)}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="capitalize">{action}</span>
                  </div>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Activity list */}
      <div className="h-screen flex-1 overflow-auto">
        <div className="space-y-4">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex flex-col gap-2 border-b py-2"
              >
                <div className="flex flex-row items-center justify-between text-xs">
                  <p className="font-medium">{activity.user}</p>
                  <p className="text-muted-foreground text-xs">
                    {activity.timestamp}
                  </p>
                </div>

                <div className="flex flex-row items-center justify-between gap-2 text-xs">
                  <Badge
                    variant="outline"
                    className={`mr-2 ${actionTypes[activity.action as keyof typeof actionTypes].color}`}
                  >
                    <span className="flex items-center gap-1">
                      {getActionIcon(activity.action)}
                      <span className="capitalize">{activity.action}</span>
                    </span>
                  </Badge>
                  {activity.item}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
              <X className="text-muted-foreground h-8 w-8" />
              <h3 className="mt-2 text-sm font-medium">
                {t("no_activities_found")}
              </h3>
              <p className="text-muted-foreground text-xs">
                {t("try_adjusting_filters")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
