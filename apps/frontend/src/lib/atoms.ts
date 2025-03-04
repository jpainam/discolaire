import { atom } from "jotai";

export const breadcrumbAtom = atom<{ name: string; url?: string }[]>([]);
