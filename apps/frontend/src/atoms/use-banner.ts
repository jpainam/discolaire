import { atomWithStorage } from "jotai/utils";

export const closedBannerAtom = atomWithStorage<number[]>("banner", []);
