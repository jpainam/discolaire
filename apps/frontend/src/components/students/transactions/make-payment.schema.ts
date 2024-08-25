import { z } from "zod";

export const makePaymentFormSchema = z.object({});

export type MakePaymentFormInput = z.infer<typeof makePaymentFormSchema>;
