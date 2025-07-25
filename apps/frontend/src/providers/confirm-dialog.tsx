import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import type { AlertDialogOverlay } from "@repo/ui/components/alert-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/components/alert-dialog";

import { useLocale } from "~/i18n";

export interface ConfirmOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  icon?: React.ReactNode;
  customActions?: (
    onConfirm: () => void,
    onCancel: () => void,
  ) => React.ReactNode;
  confirmButton?: React.ComponentPropsWithRef<typeof AlertDialogAction>;
  cancelButton?: React.ComponentPropsWithRef<typeof AlertDialogCancel> | null;
  alertDialogOverlay?: React.ComponentPropsWithRef<typeof AlertDialogOverlay>;
  alertDialogContent?: React.ComponentPropsWithRef<typeof AlertDialogContent>;
  alertDialogHeader?: React.ComponentPropsWithRef<typeof AlertDialogHeader>;
  alertDialogTitle?: React.ComponentPropsWithRef<typeof AlertDialogTitle>;
  alertDialogDescription?: React.ComponentPropsWithRef<
    typeof AlertDialogDescription
  >;
  alertDialogFooter?: React.ComponentPropsWithRef<typeof AlertDialogFooter>;
}

export interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

export const ConfirmContext = createContext<ConfirmContextType | undefined>(
  undefined,
);

const baseDefaultOptions: ConfirmOptions = {
  title: "",
  description: "",
  confirmText: "Confirm",
  cancelText: "Cancel",
  confirmButton: {},
  cancelButton: {},
  alertDialogContent: {},
  alertDialogHeader: {},
  alertDialogTitle: {},
  alertDialogDescription: {},
  alertDialogFooter: {},
};

const ConfirmDialogContent: React.FC<{
  config: ConfirmOptions;
  onConfirm: () => void;
  onCancel: () => void;
}> = memo(({ config, onConfirm, onCancel }) => {
  const {
    title,
    description,
    cancelButton,
    confirmButton,
    confirmText,
    cancelText,
    icon,
    customActions,
    //alertDialogOverlay,
    alertDialogContent,
    alertDialogHeader,
    alertDialogTitle,
    alertDialogDescription,
    alertDialogFooter,
  } = config;

  const { t } = useLocale();

  return (
    // <AlertDialogPortal>
    //   <AlertDialogOverlay {...alertDialogOverlay} />
    <AlertDialogContent {...alertDialogContent}>
      <AlertDialogHeader {...alertDialogHeader}>
        {(title ?? icon) && (
          <AlertDialogTitle {...alertDialogTitle}>
            {icon}
            {title}
          </AlertDialogTitle>
        )}
        {description && (
          <AlertDialogDescription {...alertDialogDescription}>
            {description}
          </AlertDialogDescription>
        )}
      </AlertDialogHeader>
      <AlertDialogFooter {...alertDialogFooter}>
        {customActions ? (
          customActions(onConfirm, onCancel)
        ) : (
          <>
            {cancelButton !== null && (
              <AlertDialogCancel onClick={onCancel} {...cancelButton}>
                {cancelText && t(cancelText)}
              </AlertDialogCancel>
            )}
            <AlertDialogAction
              onClick={onConfirm}
              className="bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-white shadow-xs"
              {...confirmButton}
            >
              {confirmText && t(confirmText)}
            </AlertDialogAction>
          </>
        )}
      </AlertDialogFooter>
    </AlertDialogContent>
    // </AlertDialogPortal>
  );
});

ConfirmDialogContent.displayName = "ConfirmDialogContent";

const ConfirmDialog: React.FC<{
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  config: ConfirmOptions;
  onConfirm: () => void;
  onCancel: () => void;
}> = memo(({ isOpen, onOpenChange, config, onConfirm, onCancel }) => (
  <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
    <ConfirmDialogContent
      config={config}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  </AlertDialog>
));

ConfirmDialog.displayName = "ConfirmDialog";

export const ConfirmDialogProvider: React.FC<{
  defaultOptions?: ConfirmOptions;
  children: React.ReactNode;
}> = ({ defaultOptions = {}, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>(baseDefaultOptions);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const mergedDefaultOptions = useMemo(
    () => ({
      ...baseDefaultOptions,
      ...defaultOptions,
    }),
    [defaultOptions],
  );

  const confirm = useCallback(
    (newOptions: ConfirmOptions) => {
      setOptions({ ...mergedDefaultOptions, ...newOptions });
      setIsOpen(true);
      return new Promise<boolean>((resolve) => {
        resolverRef.current = resolve;
      });
    },
    [mergedDefaultOptions],
  );

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    if (resolverRef.current) resolverRef.current(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    if (resolverRef.current) resolverRef.current(false);
  }, []);

  const contextValue = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmContext.Provider value={contextValue}>
      {children}
      <ConfirmDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        config={options}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmContext.Provider>
  );
};

export const useConfirm = (): ((
  options: ConfirmOptions,
) => Promise<boolean>) => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmDialogProvider");
  }
  return context.confirm;
};
