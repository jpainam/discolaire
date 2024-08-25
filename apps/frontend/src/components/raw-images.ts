import { StaticImageData } from "next/image";
import Avatar01 from "../../public/avatars/avatar-01.webp";
import Avatar02 from "../../public/avatars/avatar-02.webp";
import Avatar03 from "../../public/avatars/avatar-03.webp";
import Avatar04 from "../../public/avatars/avatar-04.webp";
import Avatar05 from "../../public/avatars/avatar-05.webp";
import Avatar06 from "../../public/avatars/avatar-06.webp";
import Avatar07 from "../../public/avatars/avatar-07.webp";
import Avatar08 from "../../public/avatars/avatar-08.webp";
import Avatar09 from "../../public/avatars/avatar-09.webp";
import Avatar10 from "../../public/avatars/avatar-10.webp";
import Avatar11 from "../../public/avatars/avatar-11.webp";
import Avatar12 from "../../public/avatars/avatar-12.webp";
import Avatar13 from "../../public/avatars/avatar-13.webp";
import Avatar14 from "../../public/avatars/avatar-14.webp";
import Avatar15 from "../../public/avatars/avatar-15.webp";

import Logo from "../../public/images/logo.webp";

export { Avatar01, Avatar02, Avatar03, Avatar04, Avatar05, Avatar06, Logo };

export const avatars: StaticImageData[] = [
  Avatar01,
  Avatar02,
  Avatar03,
  Avatar04,
  Avatar05,
  Avatar06,
  Avatar07,
  Avatar08,
  Avatar09,
  Avatar10,
  Avatar11,
  Avatar12,
  Avatar13,
  Avatar14,
  Avatar15,
];
export function randomAvatar(pos?: number): StaticImageData {
  if (pos != undefined) {
    return avatars[pos % avatars.length];
  }
  const av = avatars[Math.floor(Math.random() * avatars.length)];
  return av || Avatar01;
}
