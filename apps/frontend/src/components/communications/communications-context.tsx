"use client";

import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type { RecipientTarget } from "./recipient-selector";
import { useModal } from "~/hooks/use-modal";
import RecipientSelector from "./recipient-selector";

interface CommunicationsState {
  composeStage: "idle" | "composing";
  recipientTarget: RecipientTarget | null;
}

interface CommunicationsContextValue extends CommunicationsState {
  startCompose: () => void;
  cancelCompose: () => void;
  confirmRecipients: (target: RecipientTarget) => void;
  editRecipients: () => void;
}

const CommunicationsContext = createContext<CommunicationsContextValue | null>(
  null,
);

export function CommunicationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { openModal, closeModal } = useModal();
  const [state, setState] = useState<CommunicationsState>({
    composeStage: "idle",
    recipientTarget: null,
  });

  const confirmRecipients = useCallback(
    (target: RecipientTarget) => {
      setState({ composeStage: "composing", recipientTarget: target });
      closeModal();
    },
    [closeModal],
  );

  const openRecipientModal = useCallback(
    (initialTarget: RecipientTarget | null) => {
      openModal({
        className: "p-0 sm:max-w-xl overflow-hidden",
        view: (
          <RecipientSelector
            initialTarget={initialTarget}
            onConfirm={confirmRecipients}
          />
        ),
      });
    },
    [openModal, confirmRecipients],
  );

  const startCompose = useCallback(() => {
    openRecipientModal(null);
  }, [openRecipientModal]);

  const cancelCompose = useCallback(() => {
    setState({ composeStage: "idle", recipientTarget: null });
  }, []);

  const editRecipients = useCallback(() => {
    openRecipientModal(state.recipientTarget);
  }, [openRecipientModal, state.recipientTarget]);

  const value = useMemo(
    () => ({
      ...state,
      startCompose,
      cancelCompose,
      confirmRecipients,
      editRecipients,
    }),
    [state, startCompose, cancelCompose, confirmRecipients, editRecipients],
  );

  return (
    <CommunicationsContext.Provider value={value}>
      {children}
    </CommunicationsContext.Provider>
  );
}

export function useCommunications() {
  const ctx = useContext(CommunicationsContext);
  if (!ctx) {
    throw new Error(
      "useCommunications must be used within CommunicationsProvider",
    );
  }
  return ctx;
}
