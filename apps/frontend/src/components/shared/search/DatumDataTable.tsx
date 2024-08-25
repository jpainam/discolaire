import { z } from "zod";

const tableSearchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  firstName: z.string().optional(),
  q: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  enrollments: z.boolean().default(false),
});

type SearchParams = Record<string, any>;

export async function DatumDataTable({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const target = searchParams["target"] || "";

  if (target === "students") {
    const search = tableSearchParamsSchema.parse(searchParams);

    return <div></div>;
  }
  return <div>Data table</div>;
}
