import { Separator } from "@repo/ui/components/separator";

import { AppearanceForm } from "~/components/users/settings/settings-form";

export default function SettingsAppearancePage() {
  return (
    <div className="px-4 ">
      <div>
        <h3 className="text-lg font-medium">Appearance</h3>
        <p className="text-sm text-muted-foreground">
          Customize the appearance of the app. Automatically switch between day
          and night themes.
        </p>
      </div>
      <Separator />
      <AppearanceForm />
    </div>
  );
}
