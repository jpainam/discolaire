/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { decode } from "entities";
/* eslint-disable @typescript-eslint/no-explicit-any */
export function getFullName(val: any) {
  return decode(
    `${val?.firstName ?? ""} ${val?.middleName ?? ""} ${val?.lastName ?? ""}`
  );
}
