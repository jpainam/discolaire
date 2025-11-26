import Link from "next/link";
import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";

export function UserLink(props: {
  name: string;
  id: string;
  avatar?: string | null;
  profile: "staff" | "student" | "contact";
  className?: string;
}) {
  const avatar = createAvatar(initials, {
    seed: props.name,
  });

  //const svg = avatar.toString();
  const urls = {
    staff: `/staffs/${props.id}`,
    student: `/students/${props.id}`,
    contact: `/contacts/${props.id}`,
  };

  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarImage
          src={props.avatar ?? avatar.toDataUri()}
          alt={props.name}
        />
        <AvatarFallback></AvatarFallback>
      </Avatar>
      <Link href={urls[props.profile]} className="hover:underline">
        {props.name}
      </Link>
    </div>
  );
}
