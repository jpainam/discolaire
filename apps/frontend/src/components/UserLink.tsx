import Link from "next/link";
import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";

export function UserLink(props: {
  name: string;
  id: string;
  avatar?: string | null;
  rootClassName?: string;
  profile: "staff" | "student" | "contact";
  className?: string;
  href?: string;
}) {
  const avatar = createAvatar(initials, {
    seed: props.name,
    fontSize: 35,
  });

  //const svg = avatar.toString();
  const urls = {
    staff: `/staffs/${props.id}`,
    student: `/students/${props.id}`,
    contact: `/contacts/${props.id}`,
  };

  return (
    <div className={cn("flex items-center gap-2", props.rootClassName)}>
      <Avatar size="sm">
        <AvatarImage
          src={props.avatar ?? avatar.toDataUri()}
          alt={props.name}
        />
        <AvatarFallback></AvatarFallback>
      </Avatar>
      <Link
        href={props.href ?? urls[props.profile]}
        className={cn("font-normal hover:underline", props.className)}
      >
        {props.name}
      </Link>
    </div>
  );
}
