import {
  immunizations,
  vaccines,
} from "@/components/students/health/data-immunization";
import { ImmunizationHeader } from "@/components/students/health/ImmunizationHeader";
import { Card, CardContent } from "@repo/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

export default function Page() {
  return (
    <div className="flex w-full flex-col gap-2">
      <ImmunizationHeader />
      <div className="border-1 flex flex-col rounded-sm border bg-accent-foreground p-2 text-accent">
        <h1 className="text-xl font-bold">
          Chers Parents - Votre enfant est-il entièrement immunisé
        </h1>
        <p>Vaccinations obligatoires pour l&apos;année scolaire </p>
      </div>
      <p>
        <strong>Instructions</strong>Pour savoir quels vaccins sont obligatoires
        pour l'école, recherchez la note de votre enfant dans la première
        colonne. Regardez la ligne correspondante sur la page pour trouver la
        quantité de vaccins requise pour que votre enfant puisse entrer à
        l'école.
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            {vaccines.map((v) => (
              <TableHead
                key={v.name}
                className="border-1 border bg-accent-foreground text-center text-accent"
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
          {immunizations.map((im) => (
            <TableRow key={im.name}>
              <TableCell className="border-1 border bg-accent-foreground font-medium text-accent">
                <div className="flex flex-col items-center gap-4 text-center">
                  <h1 className="font-bold">{im.name}</h1>
                  <p>{im.description}</p>
                </div>
              </TableCell>
              {Object.values(im.vaccines).map((v) => (
                <TableCell className="p-1 text-center" key={v}>
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
  );
}
