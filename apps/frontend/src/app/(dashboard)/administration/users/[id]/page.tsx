import Link from "next/link";

import { Button } from "~/components/ui/button";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const userId = params.id;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="ml-auto items-center gap-4">
          <Button asChild>
            <Link href={`/administration/users/${userId}/permissions`}>
              Ses permissions
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
