import Image from "next/image";

import { cn } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
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
      <Avatar className={cn("my-1 h-8 w-8", className)}>
        <AvatarImage src={avatar ?? undefined} alt={"AV"} />
        <AvatarFallback>
          {generatedAvatar && (
            <Image className={cn(className)} src={generatedAvatar} alt="AV" />
          )}
        </AvatarFallback>
      </Avatar>
    </>
  );
}
