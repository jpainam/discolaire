// "use client";
// /**
//  * This hook is used to get the current school year.
//  */
// export function useSchoolYear() {
//   const v = document.cookie.split(";").find((c) => c.includes("schoolYear"));
//   if (!v) {
//     return null;
//   }
//   const [_, schoolYear] = v.split("=");
//   return schoolYear;
// }
