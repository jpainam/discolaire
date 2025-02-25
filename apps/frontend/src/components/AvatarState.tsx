import Image from "next/image";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui//components/avatar";
import { cn } from "~/lib/utils";
import { avatars, randomAvatar } from "./raw-images";

interface AvatarStateProps {
  avatar?: string | null;
  className?: string;
  pos?: number;
}

export function AvatarState({ avatar, className, pos }: AvatarStateProps) {
  let generatedAvatar;
  if (pos != undefined) {
    generatedAvatar = avatars[pos % avatars.length];
  } else {
    generatedAvatar = randomAvatar();
  }
  return (
    <>
      <Avatar className={cn("my-0 h-8 w-8", className)}>
        <AvatarImage src={avatar ?? undefined} alt={"AV"} />
        <AvatarFallback>
          {generatedAvatar && (
            <Image
              className={cn(className)}
              height={50}
              width={50}
              src={generatedAvatar}
              alt="AV"
            />
          )}
        </AvatarFallback>
      </Avatar>
    </>
  );
}
