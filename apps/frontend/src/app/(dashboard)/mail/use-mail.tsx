import { atom, useAtom } from "jotai";

import { Mail, mails } from "~/app/(dashboard)/mail/data";

type Config = {
  selected: Mail["id"] | null;
};

const configAtom = atom<Config>({
  selected: mails[0]?.id ?? null,
});

export function useMail() {
  return useAtom(configAtom);
}
