import { Card, CardContent, CardTitle } from "@repo/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { CardDescription, CardHeader } from "@repo/ui/components/card";
import {
  immunizations,
  vaccines,
} from "~/components/students/health/data-immunization";
//import { ImmunizationHeader } from "~/components/students/health/ImmunizationHeader";
export default function Page() {
  return (
    <div className="flex w-full flex-col gap-2 p-4">
      {/* <ImmunizationHeader /> */}
      <Card>
        <CardHeader>
          <CardTitle>
            Chers Parents - Votre enfant est-il entièrement immunisé
          </CardTitle>
          <CardDescription>
            Pour savoir quels vaccins sont obligatoires pour l'école, recherchez
            la note de votre enfant dans la première colonne. Regardez la ligne
            correspondante sur la page pour trouver la quantité de vaccins
            requise pour que votre enfant puisse entrer à l'école.
          </CardDescription>
        </CardHeader>
        {/* <p>Vaccinations obligatoires pour l&apos;année scolaire </p> */}
        <CardContent>
          <div className="bg-background overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  {vaccines.map((v, index) => (
                    <TableHead
                      key={`${v.name}-${index}`}
                      className=" bg-muted text-muted-foreground text-center"
                    >
                      <div className="flex flex-col items-center gap-4 text-center">
                        <h1 className="font-bold">{v.name}</h1>
                        <p>{v.description}</p>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {immunizations.map((im, index) => (
                  <TableRow key={`${im.name}-im-${index}`}>
                    <TableCell className=" bg-muted text-muted-foreground font-medium">
                      <div className="flex flex-col items-center gap-4 text-center">
                        <h1 className="font-bold">{im.name}</h1>
                        <p>{im.description}</p>
                      </div>
                    </TableCell>
                    {Object.values(im.vaccines).map((v, index) => (
                      <TableCell
                        className="p-1 text-center"
                        key={`${v}-vac-${index}`}
                      >
                        <Card className="cursor-pointer content-center items-center justify-center rounded-lg p-1 text-center shadow-sm">
                          <CardContent className="content-center items-center justify-center text-center">
                            {v}
                          </CardContent>
                        </Card>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
