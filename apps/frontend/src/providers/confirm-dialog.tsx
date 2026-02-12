/* eslint-disable @typescript-eslint/no-unused-vars */
import type React from "react";
import type {
  ComponentPropsWithRef,
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from "react";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useTranslations } from "next-intl";

import type { AlertDialogOverlay } from "~/components/ui/alert-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPortal,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Spinner } from "~/components/ui/spinner";

export interface CustomActionsProps {
  confirm: (event?: ReactMouseEvent<HTMLButtonElement>) => void;
  cancel: () => void;
  config: ConfirmOptions;
  isConfirming: boolean;
  setConfig: ConfigUpdater;
}

export type ConfigUpdater = (
  config: ConfirmOptions | ((prev: ConfirmOptions) => ConfirmOptions),
) => void;

export type LegacyCustomActions = (
  onConfirm: () => void,
  onCancel: () => void,
) => ReactNode;

export type EnhancedCustomActions = (props: CustomActionsProps) => ReactNode;

export interface ConfirmOptions {
  title?: ReactNode;
  description?: ReactNode;
  contentSlot?: ReactNode;
  onConfirm?: () => void | Promise<void>;
  confirmText?: string;
  cancelText?: string;
  icon?: ReactNode;
  customActions?: LegacyCustomActions | EnhancedCustomActions;
  confirmButton?: ComponentPropsWithRef<typeof AlertDialogAction>;
  cancelButton?: ComponentPropsWithRef<typeof AlertDialogCancel> | null;
  alertDialogOverlay?: ComponentPropsWithRef<typeof AlertDialogOverlay>;
  alertDialogContent?: ComponentPropsWithRef<typeof AlertDialogContent>;
  alertDialogHeader?: ComponentPropsWithRef<typeof AlertDialogHeader>;
  alertDialogTitle?: ComponentPropsWithRef<typeof AlertDialogTitle>;
  alertDialogDescription?: ComponentPropsWithRef<typeof AlertDialogDescription>;
  alertDialogFooter?: ComponentPropsWithRef<typeof AlertDialogFooter>;
}

export interface ConfirmDialogState {
  isOpen: boolean;
  isConfirming: boolean;
  config: ConfirmOptions;
  resolver: ((value: boolean) => void) | null;
}

export interface ConfirmContextValue {
  confirm: ConfirmFunction;
  updateConfig: ConfigUpdater;
}

export interface ConfirmFunction {
  (options: ConfirmOptions): Promise<boolean>;
  updateConfig?: ConfigUpdater;
}

export const ConfirmContext = createContext<ConfirmContextValue | undefined>(
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

function isLegacyCustomActions(
  fn: LegacyCustomActions | EnhancedCustomActions,
): fn is LegacyCustomActions {
  return fn.length === 2;
}

const ConfirmDialogContent: React.FC<{
  config: ConfirmOptions;
  isConfirming: boolean;
  onConfirm: (event?: ReactMouseEvent<HTMLButtonElement>) => void;
  onCancel: () => void;
  setConfig: (
    config: ConfirmOptions | ((prev: ConfirmOptions) => ConfirmOptions),
  ) => void;
}> = memo(({ config, isConfirming, onConfirm, onCancel, setConfig }) => {
  const {
    title,
    description,
    cancelButton,
    confirmButton,
    confirmText,
    cancelText,
    icon,
    contentSlot,
    customActions,
    alertDialogOverlay,
    alertDialogContent,
    alertDialogHeader,
    alertDialogTitle,
    alertDialogDescription,
    alertDialogFooter,
  } = config;

  const t = useTranslations();

  const renderActions = () => {
    if (!customActions) {
      return (
        <>
          {cancelButton !== null && (
            <AlertDialogCancel
              onClick={onCancel}
              {...cancelButton}
              disabled={Boolean(cancelButton?.disabled) || isConfirming}
              variant={"secondary"}
            >
              {cancelText && t(cancelText)}
            </AlertDialogCancel>
          )}
          <AlertDialogAction
            onClick={onConfirm}
            {...confirmButton}
            disabled={Boolean(confirmButton?.disabled) || isConfirming}
            variant={"destructive"}
          >
            <span className="inline-flex items-center gap-2">
              {isConfirming && <Spinner />}
              {confirmText && t(confirmText)}
            </span>
          </AlertDialogAction>
        </>
      );
    }

    if (isLegacyCustomActions(customActions)) {
      return customActions(onConfirm, onCancel);
    }

    return customActions({
      confirm: onConfirm,
      cancel: onCancel,
      config,
      isConfirming,
      setConfig,
    });
  };

  const renderTitle = () => {
    if (!title && !icon) {
      return null;
    }

    return (
      <AlertDialogTitle {...alertDialogTitle}>
        {icon}
        {title}
      </AlertDialogTitle>
    );
  };

  return (
    <AlertDialogPortal>
      {/* <AlertDialogOverlay {...alertDialogOverlay} /> */}
      <AlertDialogContent {...alertDialogContent}>
        <AlertDialogHeader {...alertDialogHeader}>
          {renderTitle()}
          {description && (
            <AlertDialogDescription {...alertDialogDescription}>
              {description}
            </AlertDialogDescription>
          )}
          {contentSlot}
        </AlertDialogHeader>
        <AlertDialogFooter {...alertDialogFooter} className="p-2">
          {renderActions()}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogPortal>
  );
});

ConfirmDialogContent.displayName = "ConfirmDialogContent";

const ConfirmDialog: React.FC<{
  isOpen: boolean;
  isConfirming: boolean;
  onOpenChange: (isOpen: boolean) => void;
  config: ConfirmOptions;
  onConfirm: (event?: ReactMouseEvent<HTMLButtonElement>) => void;
  onCancel: () => void;
  setConfig: (
    config: ConfirmOptions | ((prev: ConfirmOptions) => ConfirmOptions),
  ) => void;
}> = memo(
  ({
    isOpen,
    isConfirming,
    onOpenChange,
    config,
    onConfirm,
    onCancel,
    setConfig,
  }) => (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <ConfirmDialogContent
        config={config}
        isConfirming={isConfirming}
        onConfirm={onConfirm}
        onCancel={onCancel}
        setConfig={setConfig}
      />
    </AlertDialog>
  ),
);

ConfirmDialog.displayName = "ConfirmDialog";

export const ConfirmDialogProvider: React.FC<{
  defaultOptions?: ConfirmOptions;
  children: React.ReactNode;
}> = ({ defaultOptions = {}, children }) => {
  const [dialogState, setDialogState] = useState<ConfirmDialogState>({
    isOpen: false,
    isConfirming: false,
    config: baseDefaultOptions,
    resolver: null,
  });

  const mergedDefaultOptions = useMemo(
    () => ({
      ...baseDefaultOptions,
      ...defaultOptions,
    }),
    [defaultOptions],
  );

  const updateConfig = useCallback(
    (
      newConfig: ConfirmOptions | ((prev: ConfirmOptions) => ConfirmOptions),
    ) => {
      setDialogState((prev) => ({
        ...prev,
        config:
          typeof newConfig === "function"
            ? newConfig(prev.config)
            : { ...prev.config, ...newConfig },
      }));
    },
    [],
  );

  const confirm = useCallback(
    (options: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        setDialogState({
          isOpen: true,
          isConfirming: false,
          config: { ...mergedDefaultOptions, ...options },
          resolver: resolve,
        });
      }),
    [mergedDefaultOptions],
  );

  const handleConfirm = useCallback(
    async (event?: ReactMouseEvent<HTMLButtonElement>) => {
      event?.preventDefault();

      const confirmHandler = dialogState.config.onConfirm;
      const resolver = dialogState.resolver;

      if (!confirmHandler) {
        resolver?.(true);
        setDialogState((prev) => ({
          ...prev,
          isOpen: false,
          isConfirming: false,
          resolver: null,
        }));
        return;
      }

      setDialogState((prev) => ({
        ...prev,
        isConfirming: true,
      }));

      try {
        await confirmHandler();
        resolver?.(true);
        setDialogState((prev) => ({
          ...prev,
          isOpen: false,
          isConfirming: false,
          resolver: null,
        }));
      } catch {
        setDialogState((prev) => ({
          ...prev,
          isConfirming: false,
        }));
      }
    },
    [dialogState.config.onConfirm, dialogState.resolver],
  );

  const handleCancel = useCallback(() => {
    setDialogState((prev) => {
      if (prev.isConfirming) {
        return prev;
      }
      if (prev.resolver) {
        prev.resolver(false);
      }
      return {
        ...prev,
        isOpen: false,
        isConfirming: false,
        resolver: null,
      };
    });
  }, []);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        handleCancel();
      }
    },
    [handleCancel],
  );

  const contextValue = useMemo(
    () => ({
      confirm,
      updateConfig,
    }),
    [confirm, updateConfig],
  );

  return (
    <ConfirmContext.Provider value={contextValue}>
      {children}
      <ConfirmDialog
        isOpen={dialogState.isOpen}
        isConfirming={dialogState.isConfirming}
        onOpenChange={handleOpenChange}
        config={dialogState.config}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        setConfig={updateConfig}
      />
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmDialogProvider");
  }

  const { confirm, updateConfig } = context;

  const enhancedConfirm = confirm;
  // eslint-disable-next-line react-hooks/immutability
  enhancedConfirm.updateConfig = updateConfig;

  return enhancedConfirm as ConfirmFunction & {
    updateConfig: ConfirmContextValue["updateConfig"];
  };
};
