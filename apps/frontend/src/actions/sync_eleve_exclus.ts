"use server";

import { db } from "@repo/db";

import { studentIdMap } from "./student_id_map";

const exclus: { elevee: number; dateExclusion: string }[] = [
  { elevee: 4475, dateExclusion: "2024-06-03" },
  { elevee: 5504, dateExclusion: "2024-06-03" },
  { elevee: 5673, dateExclusion: "2024-06-03" },
  { elevee: 5568, dateExclusion: "2024-06-03" },
  { elevee: 5429, dateExclusion: "2024-06-03" },
  { elevee: 4795, dateExclusion: "2024-05-31" },
  { elevee: 1397, dateExclusion: "2024-07-15" },
  { elevee: 3892, dateExclusion: "2024-07-15" },
  { elevee: 5531, dateExclusion: "2024-07-15" },
  { elevee: 3958, dateExclusion: "2024-07-15" },
  { elevee: 5263, dateExclusion: "2024-07-15" },
  { elevee: 5268, dateExclusion: "2024-07-15" },
  { elevee: 5331, dateExclusion: "2024-07-15" },
  { elevee: 5536, dateExclusion: "2024-07-15" },
  { elevee: 5528, dateExclusion: "2024-07-15" },
  { elevee: 4812, dateExclusion: "2024-07-15" },
  { elevee: 5678, dateExclusion: "2024-07-15" },
  { elevee: 4562, dateExclusion: "2024-07-15" },
  { elevee: 4594, dateExclusion: "2024-07-15" },
  { elevee: 3934, dateExclusion: "2024-07-15" },
  { elevee: 4406, dateExclusion: "2024-07-15" },
  { elevee: 4600, dateExclusion: "2024-07-15" },
  { elevee: 4185, dateExclusion: "2024-07-15" },
  { elevee: 4773, dateExclusion: "2024-07-15" },
  { elevee: 3678, dateExclusion: "2024-05-31" },
  { elevee: 4626, dateExclusion: "2024-05-31" },
  { elevee: 5567, dateExclusion: "2024-05-31" },
  { elevee: 5502, dateExclusion: "2024-05-31" },
  { elevee: 5447, dateExclusion: "2024-05-31" },
  { elevee: 5514, dateExclusion: "2024-05-31" },
  { elevee: 4627, dateExclusion: "2024-05-31" },
  { elevee: 4700, dateExclusion: "2024-05-31" },
  { elevee: 5559, dateExclusion: "2024-05-31" },
  { elevee: 4816, dateExclusion: "2024-05-31" },
  { elevee: 5266, dateExclusion: "2024-05-31" },
  { elevee: 5379, dateExclusion: "2024-05-31" },
  { elevee: 4825, dateExclusion: "2024-05-31" },
  { elevee: 4779, dateExclusion: "2024-05-31" },
  { elevee: 4858, dateExclusion: "2024-05-31" },
  { elevee: 5510, dateExclusion: "2024-05-31" },
  { elevee: 5608, dateExclusion: "2024-05-31" },
  { elevee: 3331, dateExclusion: "2024-05-31" },
  { elevee: 4783, dateExclusion: "2024-05-31" },
  { elevee: 5640, dateExclusion: "2024-05-31" },
  { elevee: 5569, dateExclusion: "2024-05-31" },
  { elevee: 811, dateExclusion: "2024-05-31" },
  { elevee: 4844, dateExclusion: "2024-05-31" },
  { elevee: 5612, dateExclusion: "2024-05-31" },
  { elevee: 5558, dateExclusion: "2024-05-31" },
  { elevee: 5645, dateExclusion: "2024-05-31" },
  { elevee: 5548, dateExclusion: "2024-05-31" },
  { elevee: 5544, dateExclusion: "2024-05-31" },
  { elevee: 2380, dateExclusion: "2024-05-31" },
  { elevee: 4738, dateExclusion: "2024-05-31" },
  { elevee: 5574, dateExclusion: "2024-05-31" },
  { elevee: 438, dateExclusion: "2024-05-31" },
  { elevee: 3805, dateExclusion: "2024-05-31" },
  { elevee: 4565, dateExclusion: "2024-05-31" },
  { elevee: 4332, dateExclusion: "2024-05-31" },
  { elevee: 5689, dateExclusion: "2024-05-31" },
  { elevee: 2678, dateExclusion: "2024-05-31" },
  { elevee: 5541, dateExclusion: "2024-06-06" },
  { elevee: 5662, dateExclusion: "2024-06-06" },
  { elevee: 5578, dateExclusion: "2024-06-06" },
  { elevee: 5671, dateExclusion: "2024-06-06" },
  { elevee: 5566, dateExclusion: "2024-06-06" },
  { elevee: 5589, dateExclusion: "2024-06-06" },
  { elevee: 3797, dateExclusion: "2024-06-06" },
  { elevee: 5552, dateExclusion: "2024-06-06" },
  { elevee: 4872, dateExclusion: "2024-06-06" },
  { elevee: 4433, dateExclusion: "2024-06-06" },
  { elevee: 4798, dateExclusion: "2024-06-06" },
  { elevee: 2211, dateExclusion: "2024-06-06" },
  { elevee: 4022, dateExclusion: "2024-06-06" },
  { elevee: 5676, dateExclusion: "2024-06-06" },
  { elevee: 5430, dateExclusion: "2024-06-06" },
  { elevee: 3567, dateExclusion: "2024-06-06" },
  { elevee: 2833, dateExclusion: "2024-06-06" },
  { elevee: 1767, dateExclusion: "2024-06-06" },
  { elevee: 3988, dateExclusion: "2024-07-15" },
  { elevee: 4637, dateExclusion: "2024-07-15" },
  { elevee: 4701, dateExclusion: "2024-07-15" },
];

export async function syncEleveExclus() {
  const exclusionMap: Record<string, string> = {};

  for (const e of exclus) {
    const uuid = studentIdMap[e.elevee.toString()];
    if (uuid) {
      exclusionMap[uuid] = e.dateExclusion;
    }
  }

  const excludedUuids = Object.keys(exclusionMap);

  const students = await db.student.findMany({
    where: {
      id: { in: excludedUuids },
    },
  });
  console.log(`Found ${students.length} students to update`);
  for (const student of students) {
    const d = exclusionMap[student.id];
    let newDate = new Date().toLocaleDateString("fr", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
    if (d) {
      newDate = new Date(d).toLocaleDateString("fr", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    }

    await db.student.update({
      where: {
        id: student.id,
      },
      data: {
        status: "EXPELLED",
        observation: `Exclu(e) le ${newDate} (saisie automatique)`,
      },
    });
    console.log(`Updated student ${student.id} - ${student.lastName}`);
  }
  return students.length;
}
