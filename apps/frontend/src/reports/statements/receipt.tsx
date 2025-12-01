import type { RouterOutputs } from "@repo/api";

import CSACongoReceipt from "./CSACongoReceipt";
import IPBWReceipt from "./IPBWReceipt";

export async function getReceipt({
  amountInWords,
  transaction,
  school,
  info,
}: {
  amountInWords: string;
  transaction: NonNullable<RouterOutputs["transaction"]["get"]>;
  info: RouterOutputs["transaction"]["getReceiptInfo"];
  school: RouterOutputs["school"]["getSchool"];
}) {
  if (school.code == "csac") {
    return await CSACongoReceipt({
      transaction: transaction,
      amountInWords: amountInWords,
      school: school,
      info: info,
    });
  } else {
    return IPBWReceipt({
      transaction: transaction,
      amountInWords: amountInWords,
      school: school,
      info: info,
    });
  }
}
