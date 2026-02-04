"use client";

import { SearchIcon, X } from "lucide-react";

import type {
  NotificationChannel,
  NotificationSourceType,
  NotificationStatus,
} from "./types";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";

interface NotificationFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  channelFilter: NotificationChannel | "all";
  onChannelChange: (value: NotificationChannel | "all") => void;
  statusFilter: NotificationStatus | "all";
  onStatusChange: (value: NotificationStatus | "all") => void;
  sourceFilter: NotificationSourceType | "all";
  onSourceChange: (value: NotificationSourceType | "all") => void;
  onClearFilters: () => void;
}

export function NotificationFilters({
  searchQuery,
  onSearchChange,
  channelFilter,
  onChannelChange,
  statusFilter,
  onStatusChange,
  sourceFilter,
  onSourceChange,
  onClearFilters,
}: NotificationFiltersProps) {
  const hasFilters =
    searchQuery ||
    channelFilter !== "all" ||
    statusFilter !== "all" ||
    sourceFilter !== "all";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <InputGroup className="md:w-1/2 lg:w-1/3">
        <InputGroupInput
          value={searchQuery}
          placeholder="Search notifications..."
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>

      <Select
        value={sourceFilter}
        onValueChange={(value) =>
          onSourceChange(value as NotificationSourceType | "all")
        }
      >
        <SelectTrigger className="bg-card border-border w-[150px]">
          <SelectValue placeholder="Source" />
        </SelectTrigger>
        <SelectContent className="bg-popover">
          <SelectItem value="all">All Sources</SelectItem>
          <SelectItem value="grades">Grades</SelectItem>
          <SelectItem value="absence_alert">Absence Alert</SelectItem>
          <SelectItem value="announcement">Announcement</SelectItem>
          <SelectItem value="payment">Payment</SelectItem>
          <SelectItem value="schedule">Schedule</SelectItem>
          <SelectItem value="report">Report</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={channelFilter}
        onValueChange={(value) =>
          onChannelChange(value as NotificationChannel | "all")
        }
      >
        <SelectTrigger className="bg-card border-border w-[140px]">
          <SelectValue placeholder="Channel" />
        </SelectTrigger>
        <SelectContent className="bg-popover">
          <SelectItem value="all">All Channels</SelectItem>
          <SelectItem value="in_app">In-App</SelectItem>
          <SelectItem value="email">Email</SelectItem>
          <SelectItem value="sms">SMS</SelectItem>
          <SelectItem value="whatsapp">WhatsApp</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={statusFilter}
        onValueChange={(value) =>
          onStatusChange(value as NotificationStatus | "all")
        }
      >
        <SelectTrigger className="bg-card border-border w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="bg-popover">
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="delivered">Delivered</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="skipped">Skipped</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-muted-foreground hover:text-foreground gap-2"
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
}
