import { atom, useAtom } from "jotai";

import type { Mail } from "~/app/(dashboard)/mail/data";
import { mails } from "~/app/(dashboard)/mail/data";

interface SubMenuConfig {
  selected: Mail["id"] | null;
}

const configAtom = atom<SubMenuConfig>({
  selected: mails[0]?.id ?? null,
});

export function useSubMenu() {
  return useAtom(configAtom);
}
