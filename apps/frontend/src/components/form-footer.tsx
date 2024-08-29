import { ReloadIcon } from "@radix-ui/react-icons";

import { Button } from "@repo/ui/button";

import { cn } from "~/lib/utils";

interface FormFooterProps {
  className?: string;
  altBtnText?: string;
  submitBtnText?: string;
  isLoading?: boolean;
  handleAltBtn?: () => void;
  altBtnClassName?: string;
  submitBtnClassName?: string;
}

//export const negMargin = "-mx-4 md:-mx-5 lg:-mx-6 3xl:-mx-8 4xl:-mx-10";

export default function FormFooter({
  isLoading,
  altBtnText = "Save as Draft",
  submitBtnText = "Submit",
  className,
  altBtnClassName,
  submitBtnClassName,
  handleAltBtn,
}: FormFooterProps) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-10 mt-4 flex items-center justify-end gap-4 border-t px-2 pt-2",
        className,
      )}
    >
      <Button
        variant="outline"
        type="reset"
        className={cn("@xl:w-auto", altBtnClassName)}
        onClick={handleAltBtn}
      >
        {altBtnText}
      </Button>
      {isLoading && (
        <Button disabled>
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </Button>
      )}
      {!isLoading && (
        <Button type="submit" className={cn("@xl:w-auto", submitBtnClassName)}>
          {submitBtnText}
        </Button>
      )}
    </div>
  );
}
