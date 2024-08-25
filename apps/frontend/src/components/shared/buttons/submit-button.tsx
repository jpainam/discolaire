"use client";

import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@repo/ui/button";
import { useFormContext } from "react-hook-form";

import { useLocale } from "~/hooks/use-locale";

type SubmitButtonProps = {
  //loading?: boolean;
  label?: string;
};
export function SubmitButton({ label }: SubmitButtonProps) {
  const { t } = useLocale();
  const {
    formState: { isSubmitting },
  } = useFormContext();
  return (
    <Button
      disabled={isSubmitting}
      className="active:enabled:translate-y-px"
      type="submit"
    >
      {isSubmitting && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}{" "}
      {label ? label : t("submit")}
    </Button>
  );
}
