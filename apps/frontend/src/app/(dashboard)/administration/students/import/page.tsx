import { getServerTranslations } from "~/app/i18n/server";

export default async function Page() {
  const { t } = await getServerTranslations();
  return (
    <div>
      <ul>
        <li>
          1. Your CSV data should be in the format below. The first line of your
          CSV file should be the column headers as in the table example. Also
          make sure that your file is UTF-8 to avoid unnecessary encoding
          problems. 2. Ifthe colum you are trying to improt is date make sure
          that is formatted in format Y-m-d (2022-12-31) 3. Duplicate
          registration number (unique) or email rows will not be imported 4. For
          student gender, use male, female value 5. For student blood group, use
          O+, O-, A+, A-, B+, B-, AB+, AB- value 6. For RTE, use Yes, No value
        </li>
      </ul>
      A vertical table, with the data type next each value. Two column table, a
      button in the right for Download Sample Import File Import new Students.
      Ajouter la CNI, Blood grouu. a selection list.
    </div>
  );
}
