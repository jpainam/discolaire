import { BirthdayCakeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { getAge, isAnniversary } from "~/utils";
import { Badge } from "../ui/badge";

export function StudentAnniversary({
  dateOfBirth,
}: {
  dateOfBirth: Date | null;
}) {
  return (
    <>
      {dateOfBirth && isAnniversary(dateOfBirth) ? (
        <Badge
          variant={"outline"}
          className="bg-pink-600 text-white dark:bg-pink-600"
        >
          <HugeiconsIcon
            icon={BirthdayCakeIcon}
            color="text-primary"
            className="animate-spin"
            strokeWidth={2}
          />
          <span>Joyeux anniversaire</span>
        </Badge>
      ) : (
        getAge(dateOfBirth) > 0 && (
          <Badge
            variant={"outline"}
            className="bg-pink-500 text-white dark:bg-pink-600"
          >
            {getAge(dateOfBirth)} ans
          </Badge>
        )
      )}
    </>
  );
}
