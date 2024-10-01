import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

export function SchoolLife() {
  const data = [
    { category: "Absents", mon: 98, tue: 64, wed: 64, thu: 64, fri: 64 },
    { category: "Retardataires", mon: 0, tue: 0, wed: 1, thu: 1, fri: 0 },
    {
      category: "Passages à l'infirmerie",
      mon: 0,
      tue: 0,
      wed: 0,
      thu: 0,
      fri: 0,
    },
    { category: "Exclusions de cours", mon: 3, tue: 0, wed: 0, thu: 0, fri: 1 },
    { category: "Punitions notifiées", mon: 4, tue: 0, wed: 0, thu: 0, fri: 5 },
    { category: "Observations", mon: 0, tue: 0, wed: 0, thu: 0, fri: 0 },
    { category: "Encouragements", mon: 0, tue: 0, wed: 0, thu: 1, fri: 0 },
    {
      category: "Convocations à la vie scolaire",
      mon: 0,
      tue: 0,
      wed: 0,
      thu: 0,
      fri: 0,
    },
  ];

  return (
    <div className="p-4">
      <h2 className="mb-4 text-center text-2xl font-bold text-primary">
        Données de la vie scolaire
      </h2>
      <div className="mb-4 text-center">
        <span className="rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
          du 18/09 au 22/09
        </span>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Catégorie</TableHead>
            <TableHead className="text-right">lun. 18</TableHead>
            <TableHead className="text-right">mar. 19</TableHead>
            <TableHead className="text-right">mer. 20</TableHead>
            <TableHead className="text-right">jeu. 21</TableHead>
            <TableHead className="text-right">ven. 22</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.category}>
              <TableCell className="font-medium">{row.category}</TableCell>
              <TableCell className="text-right">{row.mon}</TableCell>
              <TableCell className="text-right">{row.tue}</TableCell>
              <TableCell className="text-right">{row.wed}</TableCell>
              <TableCell className="text-right">{row.thu}</TableCell>
              <TableCell className="text-right">{row.fri}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
