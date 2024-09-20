"use server";

import { client } from "@repo/kv";

export async function setViewCount(path: string) {
  return client.incr(`views-${path}`);
}
