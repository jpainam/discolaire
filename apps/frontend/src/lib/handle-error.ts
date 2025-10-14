import { toast } from "sonner";
import { z } from "zod/v4";

export function getErrorMessage(err: unknown) {
  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message;
    });
    return errors.join("\n");
  } else if (err instanceof Error) {
    return err.message;
  } else {
    throw err;
  }
}

export function showErrorToast(err: unknown) {
  const errorMessage = getErrorMessage(err);
  return toast.error(errorMessage);
}
