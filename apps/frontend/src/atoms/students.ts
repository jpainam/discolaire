import { atom } from "jotai";

import type { Student } from "@repo/db";

export const enrolledStudentsAtom = atom<Student[]>([]);
export const unenrolledStudentsAtom = atom<Student[]>([]);
