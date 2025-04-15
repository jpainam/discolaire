"use client";

import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";

interface EmailType {
  id: string;
  from: string;
  email: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  folder: string;
  group: string;
  avatar: string;
  thread: {
    id: string;
    from: string;
    email: string;
    to: string;
    subject: string;
    content: string;
    date: string;
    avatar: string;
  }[];
}
interface MailContextProps {
  activeView: string;
  setActiveView: (view: string) => void;
  composing: boolean;
  setComposing: (composing: boolean) => void;
  selectedEmail: string | null;
  setSelectedEmail: (emailId: string | null) => void;
  setAttachedFiles: (files: File[]) => void;
  attachedFiles: File[];
  emails: EmailType[];
}

export const MailContext = createContext<MailContextProps | undefined>(
  undefined
);

export function useMailContext() {
  const context = useContext(MailContext);
  if (!context) {
    throw new Error(
      "useMailContext must be used within a <MailContextProvider />"
    );
  }
  return context;
}

export const MailContextProvider = (
  props: PropsWithChildren<{
    activeView: string;
    emails: EmailType[];
  }>
) => {
  const [activeView, setActiveView] = useState(props.activeView);
  const [composing, setComposing] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  return (
    <MailContext.Provider
      value={{
        emails: props.emails,
        activeView,
        setSelectedEmail,
        setAttachedFiles,
        attachedFiles,
        selectedEmail,
        setActiveView,
        composing,
        setComposing,
      }}
    >
      {props.children}
    </MailContext.Provider>
  );
};
