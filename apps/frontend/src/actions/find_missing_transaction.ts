"use server";

import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "ipw_oct",
});

export async function find_missing_transaction2() {
  const [results] = await connection.execute(
    "SELECT c.*, co.*, el.NOM, el.PRENOM  FROM caisses c  " +
      " INNER JOIN comptes_eleves co ON co.IDCOMPTE = c.COMPTE " +
      " INNER JOIN eleves el ON el.IDELEVE = co.ELEVE ORDER BY DATETRANSACTION DESC LIMIT 50",
  );
  console.log(results);
  return results;
}
