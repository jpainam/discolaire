import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { missing_transactions } from "~/actions/miss_transaction";

export function OldTransactionList() {
  const userMappings: Record<string, string> = {
    "162": "TINGO NDOUMBE VALANTINE",
    "77": "KOUNGOU TSOGO Jeanne Marie",
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>date</TableHead>
          <TableHead>transaction ref</TableHead>
          <TableHead>Saisie par</TableHead>
          <TableHead>montant</TableHead>
          <TableHead>Eleve</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {missing_transactions.map((a, index) => {
          return (
            <TableRow key={index}>
              <TableCell>
                {new Date(a.DATETRANSACTION).toLocaleDateString("fr", {
                  month: "short",
                  year: "2-digit",
                  day: "numeric",
                })}
              </TableCell>
              <TableCell>{a.REFTRANSACTION}</TableCell>
              <TableCell>{userMappings[a.ENREGISTRERPAR]}</TableCell>
              <TableCell>{a.MONTANT}</TableCell>
              <TableCell>
                {a.NOM} {a.PRENOM}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
