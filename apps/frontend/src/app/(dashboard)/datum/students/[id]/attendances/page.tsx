import { AlertCircle, Check, Clock, UserX } from "lucide-react";

import { getServerTranslations } from "@repo/i18n/server";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { Separator } from "@repo/ui/separator";

export default async function Page() {
  const { t } = await getServerTranslations();
  return (
    <div className="grid gap-4 md:grid-cols-[300px_1fr]">
      <div className="h-screen space-y-4 divide-x border-r">
        <div className="flex items-center gap-2 p-2">
          <Clock className="h-5 w-5" />
          <div className="flex flex-col">
            <span className="text-md font-semibold">{t("all_absences")}</span>
            <span className="text-sm text-muted-foreground">
              {t("justified")}
            </span>
          </div>
          <span className="ml-auto font-bold">20</span>
        </div>
        <Separator />
        <div className="flex items-center gap-2">
          <UserX className="h-5 w-5" />
          <div>
            <h2 className="font-semibold">Absences aux cours</h2>
            <p className="text-sm">25h00 de cours manquées</p>
          </div>
          <span className="ml-auto font-bold">2</span>
        </div>

        <Separator />

        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <div>
            <h2 className="font-semibold">Retards</h2>
            <p className="text-sm">Non justifié(s) : 1</p>
          </div>
          <span className="ml-auto font-bold">2</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="actions"
            //checked={showActionRequired}
            //onCheckedChange={setShowActionRequired}
          />
          <label htmlFor="actions" className="text-sm">
            Uniquement les évènements qui nécessitent une action
          </label>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Ven. 25 oct. à 8h00</h3>
                <Button
                  variant="secondary"
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Justifier
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">5 min.</p>
              <p className="text-sm text-red-500">Retard à justifier</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-lg border p-4">
            <Check className="h-5 w-5 text-green-500" />
            <div className="flex-1">
              <h3 className="font-semibold">Jeu. 24 oct. à 8h00</h3>
              <p className="text-sm text-muted-foreground">5 min.</p>
              <p className="text-sm text-muted-foreground">
                Motif : SANS EXCUSES
              </p>
              <p className="text-sm">Retard justifié</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
