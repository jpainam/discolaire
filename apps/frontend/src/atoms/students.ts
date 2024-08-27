import { atom } from "jotai";

import type { Student } from "~/types/student";

export const enrolledStudentsAtom = atom<Student[]>([]);
export const unenrolledStudentsAtom = atom<Student[]>([]);
