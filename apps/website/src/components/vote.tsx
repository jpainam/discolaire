import { client } from "@repo/kv";

import { VoteButton } from "~/components/vote-button";

type Props = {
  id: string;
};

export async function Vote({ id }: Props) {
  const count = await client.mget(`apps:${id}`);

  return <VoteButton count={count.at(0)} id={id} />;
}
