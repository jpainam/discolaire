import { Square } from "lucide-react";

import { Card, CardContent } from "~/components/ui/card";

export function SalarySummaryCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 pt-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 rounded-lg p-3">
              <Square className="text-primary h-6 w-6" />
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-sm">
                Total Paiements
              </p>
              <p className="text-3xl font-semibold">1</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-orange-100 p-3">
              <Square className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-sm">En Attente</p>
              <p className="text-3xl font-semibold text-orange-500">1</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-green-100 p-3">
              <Square className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-sm">Payés</p>
              <p className="text-3xl font-semibold text-green-500">0</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-blue-100 p-3">
              <Square className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-sm">
                Total ce mois
              </p>
              <p className="text-3xl font-semibold text-blue-500">0</p>
              <p className="text-muted-foreground mt-1 text-xs">FCFA</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
