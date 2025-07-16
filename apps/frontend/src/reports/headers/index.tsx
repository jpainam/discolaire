import type { Style } from "@react-pdf/stylesheet";
import type { RouterOutputs } from "@repo/api";
import { CSACongoHeader } from "./CSACongo";
import { IPBWHeader } from "./IPBWHeader";
export function getHeader(
  school: RouterOutputs["school"]["getSchool"],
  style?: Style,
) {
  if (school.code == "csabrazzaville") {
    return <CSACongoHeader school={school} />;
  } else {
    return <IPBWHeader school={school} style={style} />;
  }
}
