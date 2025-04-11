/* eslint-disable @next/next/no-img-element */
import Image from "next/image";

import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/components/dialog";
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
    <Dialog>
      <DialogTrigger asChild>
        <Avatar className={cn("my-0 h-8 w-8 cursor-pointer", className)}>
          <AvatarImage
            src={avatar ? `/api/download/avatars/${avatar}` : undefined}
            alt={"AV"}
          />
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
      </DialogTrigger>
      <DialogContent className="max-w-[90%] sm:max-w-[600px] p-0">
        <VisuallyHidden>
          <DialogTitle></DialogTitle>
        </VisuallyHidden>
        <img
          src={avatar ? `/api/download/avatars/${avatar}` : generatedAvatar}
          alt="Full Image"
          className="w-full h-auto rounded-lg"
        />
      </DialogContent>
    </Dialog>
  );
}
