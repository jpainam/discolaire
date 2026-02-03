"use client";

import { useParams } from "next/navigation";
import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { AddTeamIcon, BlockedIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock,
  MessageCircle,
  MoreVertical,
  Phone,
  Shield,
  ShieldCheck,
} from "lucide-react";

import type { RouterOutputs } from "@repo/api";

import type { ParentContact } from "./parent-data";
import { Badge } from "~/components/base-badge";
import { AddStudentToParent } from "~/components/contacts/AddStudentToParent";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import { useModal } from "~/hooks/use-modal";
import { EditIcon, MailIcon, PrinterIcon } from "~/icons";
import { getFullName } from "~/utils";

interface ProfileHeaderProps {
  parent: ParentContact;
  contact: RouterOutputs["contact"]["get"];
}

export function ProfileHeader({ parent, contact }: ProfileHeaderProps) {
  const params = useParams<{ id: string }>();
  const contactId = params.id;
  const contact_initials = `${parent.firstName.charAt(0)}${parent.lastName.charAt(0)}`;

  const { openModal } = useModal();
  const avatar = createAvatar(initials, {
    seed: getFullName(contact),
  });

  return (
    <div className="px-4 py-2">
      <div className="flex flex-col gap-2 lg:flex-row">
        <div className="flex flex-col items-center gap-3">
          <Avatar className="border-primary/20 size-20">
            <AvatarImage
              src={
                contact.avatar
                  ? `/api/avatars/${contact.avatar}`
                  : avatar.toDataUri()
              }
              alt={`${parent.firstName} ${parent.lastName}`}
            />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
              {contact_initials}
            </AvatarFallback>
          </Avatar>

          <Badge
            variant={contact.isActive ? "success" : "destructive"}
            appearance={"outline"}
            size={"sm"}
          >
            {parent.status.toUpperCase()}
          </Badge>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Label className="text-xl">{getFullName(contact)}</Label>
                {parent.portalAccess && (
                  <Badge variant="outline" className="gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Portal Access
                  </Badge>
                )}
              </div>
              <div className="text-muted-foreground text-md">
                {contact.occupation} {contact.employer}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline">
                <EditIcon />
                Edit
              </Button>
              <Button variant="outline">
                <PrinterIcon />
                Print
              </Button>
              <Button
                onClick={() => {
                  openModal({
                    className: "sm:max-w-xl",
                    title: `Ajouter élèves à ${getFullName(contact)}`,
                    description: "Sélectionner les élèves à ajouter au contact",
                    view: <AddStudentToParent contactId={contactId} />,
                  });
                }}
                variant={"outline"}
              >
                <HugeiconsIcon
                  icon={AddTeamIcon}
                  strokeWidth={2}
                  className="size-4"
                />
                Ajouter élèves
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <MailIcon />
                    Send Email
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Phone />
                    Call Now
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageCircle />
                    Send SMS
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Shield />
                    Manage Access
                  </DropdownMenuItem>
                  <DropdownMenuItem variant="destructive">
                    <HugeiconsIcon
                      icon={BlockedIcon}
                      strokeWidth={2}
                      className="size-4"
                    />
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
