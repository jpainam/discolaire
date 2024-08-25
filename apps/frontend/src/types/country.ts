import { z } from "zod";

export const countrySchema = z.object({
  id: z.string(),
  name: z.string(),
  codeIso3: z.string().nullish(),
});

export type Country = z.infer<typeof countrySchema>;
