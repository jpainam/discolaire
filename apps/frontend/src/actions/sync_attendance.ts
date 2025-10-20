"use server";

/**
 * The uniquee realiser by staff:
 * 119: 535a9326-5f5e-4fa6-a58b-f87decf716de, user: c738c503-73a3-40e8-8d31-f9bfdac7e6c0
 * 208: fa23005a-fbda-4c41-bbc3-f42a1a4d9e01, user: a41bb4e0-be69-4623-86f0-cd761bed25d9
 * 154: db43931b-3ac9-4530-8a16-1af09e178aa5, user: 99872187-34d6-4a0c-bad9-e8413cf935a9
 * admin: http://192.168.1.112:3000/users/04c268f7-81c4-436a-905f-7b2a6462e67c
 */
import { AttendanceType } from "@repo/db/enums";

import { db } from "~/lib/db";
import { absence_data } from "./absences_periodiques";
import { studentIdMap } from "./student_id_map";

const staff_map: Record<string, string> = {
  "119": "c738c503-73a3-40e8-8d31-f9bfdac7e6c0",
  //"208": "a41bb4e0-be69-4623-86f0-cd761bed25d9",
  "208": "04c268f7-81c4-436a-905f-7b2a6462e67c",
  "154": "99872187-34d6-4a0c-bad9-e8413cf935a9",
};

const term_mapp: Record<string, string> = {
  "31": "cmcrgl4lk0001rzoxvomixvm0",
  "32": "cmcrgl4lu0003rzoxyk43dtsu",
  "33": "cmcrgl4lv0005rzoxw90brh7u",
  "34": "cmcrgl4lw0007rzoxgbpqbjmj",
  "35": "cmcrgl4lx0009rzoxv0nzy55g",
  "36": "cmcrgl4ly000brzoxez6dp2df",
  "37": "cmcrgl4lz000drzox7nbnbd1u",
  "38": "cmcrgl4m0000frzox2voapw28",
  "39": "cmcrgl4m1000hrzox3ulpuhzx",
  "40": "cmcrgl4m2000jrzoxwcbhxpr8",
  "41": "cmcrgl4m3000lrzoxdk7h2ago",
  "42": "cmcrgl4m3000nrzoxkrs97kc3",
  "43": "cmcrgl4m5000przoxvpek31gt",
  "44": "cmcrgl4m5000rrzoxzvr9pfwk",
  "45": "cmcrgl4m6000trzoxa7ihuiyp",
  "46": "cmcrgl4m7000vrzoxyvp2infe",
  "47": "cmcrgl4m7000xrzoxa9v98tiw",
  "48": "cmcrgl4m8000zrzoxcsps5f4c",
  "49": "cmcrgl4m80011rzoxiuu68nm0",
  "50": "cmcrgl4m90013rzoxqn7474qt",
  "51": "cmcrgl4ma0015rzoxbvwqt1di",
  "52": "cmcrgl4mb0017rzox9wb5wail",
  "53": "cmcrgl4mb0019rzoxzcuo7oar",
  "54": "cmcrgl4mc001brzoxxuk7c6xq",
  "55": "cmcrgl4md001drzoxl0ym5i05",
  "56": "cmcrgl4me001frzoxierhxeml",
  "57": "cmcrgl4mf001hrzox9vskwc62",
  "58": "cmcrgl4mf001jrzoxzi9q4c9j",
  "59": "cmcrgl4mg001lrzoxe5cji98b",
  "60": "cmcrgl4mh001nrzoxy8htbde1",
};
export async function sync_attendance() {
  const data = [];
  for (const a of absence_data) {
    const uuid = studentIdMap[a.ELEVE.toString()];
    const termId = term_mapp[a.SEQUENCE.toString()];
    const createdById = staff_map[a.REALISERPAR.toString()];
    if (uuid && termId && createdById) {
      const d = {
        type: AttendanceType.PERIODIC,
        studentId: uuid,
        createdAt: new Date(a.DATESAISIE),
        termId: termId,
        createdById: createdById,
        data: {
          absence: a.ABSENCE,
          justifiedAbsence: a.JUSTIFIER,
          consigne: a.CONSIGNE,
        },
      };
      data.push(d);
    }
  }
  console.log(">>>>>>>> We have ", data.length);
  const r = await db.attendance.createMany({
    data: data,
  });
  return r.count;
}
