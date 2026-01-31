"use client";

import {
  Camera,
  Clock,
  Edit,
  Mail,
  MessageCircle,
  MoreVertical,
  Phone,
  Printer,
  Shield,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

import type { ParentContact } from "./parent-data";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface ProfileHeaderProps {
  parent: ParentContact;
}

export function ProfileHeader({ parent }: ProfileHeaderProps) {
  const initials = `${parent.firstName.charAt(0)}${parent.lastName.charAt(0)}`;
  const statusColors = {
    active: "bg-success text-success-foreground",
    inactive: "bg-muted text-muted-foreground",
    blocked: "bg-destructive text-destructive-foreground",
  };

  return (
    <div className="bg-card border-border rounded-xl border p-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <Avatar className="border-primary/20 h-28 w-28 border-4">
              <AvatarImage
                src={parent.photo || "/placeholder.svg"}
                alt={`${parent.firstName} ${parent.lastName}`}
              />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="secondary"
              className="absolute -right-1 -bottom-1 h-8 w-8 rounded-full shadow-md"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <Badge className={statusColors[parent.status]}>
            {parent.status.toUpperCase()}
          </Badge>
        </div>

        {/* Info Section */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-foreground text-2xl font-bold">
                  {parent.lastName.toUpperCase()}, {parent.firstName}
                </h1>
                {parent.portalAccess && (
                  <Badge variant="outline" className="gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Portal Access
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mt-1">
                {parent.profession} at {parent.employer}
              </p>
              <p className="text-muted-foreground mt-0.5 text-sm">
                ID: {parent.id}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1 bg-transparent"
              >
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 bg-transparent"
              >
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">Print</span>
              </Button>
              <Button
                size="sm"
                className="bg-accent hover:bg-accent/90 text-accent-foreground gap-1"
              >
                <UserPlus className="h-4 w-4" />
                Link Students
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Phone className="mr-2 h-4 w-4" />
                    Call Now
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Send SMS
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Shield className="mr-2 h-4 w-4" />
                    Manage Access
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Block Contact
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="border-border mt-6 grid grid-cols-2 gap-4 border-t pt-6 sm:grid-cols-4">
            <div className="text-center sm:text-left">
              <p className="text-primary text-2xl font-bold">
                {parent.students.length}
              </p>
              <p className="text-muted-foreground text-sm">
                Connected Students
              </p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-primary text-2xl font-bold">
                {parent.engagementScore}%
              </p>
              <p className="text-muted-foreground text-sm">Engagement Score</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-primary text-2xl font-bold">
                {parent.events.filter((e) => e.attended).length}/
                {parent.events.length}
              </p>
              <p className="text-muted-foreground text-sm">Events Attended</p>
            </div>
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <div className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Last Login</span>
              </div>
              <p className="text-sm font-medium">
                {new Date(parent.lastLogin).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
