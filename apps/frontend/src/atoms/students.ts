import { atom } from "jotai";

import { Student } from "~/types/student";

export const enrolledStudentsAtom = atom<Student[]>([]);
export const unenrolledStudentsAtom = atom<Student[]>([]);
