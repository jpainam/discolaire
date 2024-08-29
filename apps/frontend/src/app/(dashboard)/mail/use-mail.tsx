import { atom, useAtom } from "jotai";

import type { Mail } from "~/app/(dashboard)/mail/data";
import { mails } from "~/app/(dashboard)/mail/data";

interface Config {
  selected: Mail["id"] | null;
}

const configAtom = atom<Config>({
  selected: mails[0]?.id ?? null,
});

export function useMail() {
  return useAtom(configAtom);
}
