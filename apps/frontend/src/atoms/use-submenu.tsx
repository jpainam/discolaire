import { atom, useAtom } from "jotai";

import { Mail, mails } from "@/app/(dashboard)/mail/data";

type SubMenuConfig = {
  selected: Mail["id"] | null;
};

const configAtom = atom<SubMenuConfig>({
  selected: mails[0]?.id ?? null,
});

export function useSubMenu() {
  return useAtom(configAtom);
}
