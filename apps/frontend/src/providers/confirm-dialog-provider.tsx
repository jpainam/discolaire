"use client";

import type { ConfirmOptions } from "~/providers/confirm-dialog";
import { ConfirmDialogProvider as BaseConfirmDialogProvider } from "~/providers/confirm-dialog";

interface Props {
  children: React.ReactNode;
  defaultOptions?: ConfirmOptions;
}

// https://github.com/Aslam97/react-confirm-dialog
export const ConfirmDialogProvider = ({ children, defaultOptions }: Props) => {
  return (
    <BaseConfirmDialogProvider defaultOptions={defaultOptions}>
      {children}
    </BaseConfirmDialogProvider>
  );
};

export default ConfirmDialogProvider;
