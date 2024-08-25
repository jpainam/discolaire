"use client";

import { useAlert } from "@/hooks/use-alert";
import { useLocale } from "@/hooks/use-locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/alert-dialog";

export default function GlobalAlert() {
  const { isOpen, title, description, closeAlert, onConfirm, onCancel } =
    useAlert();
  const { t } = useLocale();
  return (
    <AlertDialog
      onOpenChange={(open) => {
        if (!open) {
          closeAlert();
        }
      }}
      open={isOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              onCancel && onCancel();
            }}
          >
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm && onConfirm();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/80"
          >
            {t("continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
