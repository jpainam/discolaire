"use server";

/**
 * The uniquee realiser by staff:
 * 119: 535a9326-5f5e-4fa6-a58b-f87decf716de, user: c738c503-73a3-40e8-8d31-f9bfdac7e6c0
 * 208: fa23005a-fbda-4c41-bbc3-f42a1a4d9e01, user: a41bb4e0-be69-4623-86f0-cd761bed25d9
 * 154: db43931b-3ac9-4530-8a16-1af09e178aa5, user: 99872187-34d6-4a0c-bad9-e8413cf935a9
 * admin: http://192.168.1.112:3000/users/04c268f7-81c4-436a-905f-7b2a6462e67c
 */

// eslint-disable-next-line @typescript-eslint/require-await
export async function sync_attendance() {
  const data = [];
  // for (const a of absence_data) {
  //   const uuid = studentIdMap[a.ELEVE.toString()];
  //   const termId = term_mapp[a.SEQUENCE.toString()];
  //   const createdById = staff_map[a.REALISERPAR.toString()];
  //   if (uuid && termId && createdById) {
  //     const d = {
  //       type: AttendanceType.PERIODIC,
  //       studentId: uuid,
  //       createdAt: new Date(a.DATESAISIE),
  //       termId: termId,
  //       createdById: createdById,
  //       data: {
  //         absence: a.ABSENCE,
  //         justifiedAbsence: a.JUSTIFIER,
  //         consigne: a.CONSIGNE,
  //       },
  //     };
  //     data.push(d);
  //   }
  // }
  console.log(">>>>>>>> We have ", data.length);
  // const r = await db.attendance.createMany({
  //   data: data,
  // });
  return 0;
}
