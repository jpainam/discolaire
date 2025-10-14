import { z } from "zod/v4";

export const makePaymentFormSchema = z.object({});

export type MakePaymentFormInput = z.infer<typeof makePaymentFormSchema>;
