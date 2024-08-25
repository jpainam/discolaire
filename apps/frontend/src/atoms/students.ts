import { Student } from "@/types/student";
import { atom } from "jotai";

export const enrolledStudentsAtom = atom<Student[]>([]);
export const unenrolledStudentsAtom = atom<Student[]>([]);
