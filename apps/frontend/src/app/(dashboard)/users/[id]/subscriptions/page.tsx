import { Separator } from "@repo/ui/components/separator";

import { DisplayForm } from "~/components/users/roles/roles-form";

export default function Page() {
  return (
    <div className="px-4">
      <div>
        <h3 className="text-lg font-medium">Display</h3>
        <p className="text-sm text-muted-foreground">
          Turn items on or off to control what&apos;s displayed in the app.
        </p>
      </div>
      <Separator />
      <DisplayForm />
    </div>
  );
}
