"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { useLocale } from "@repo/i18n";
import { useCreateQueryString } from "@repo/lib/hooks/create-query-string";
import { Form } from "@repo/ui/form";

import FormFooter from "~/components/form-footer";
import { routes } from "~/configs/routes";
import {
  MakePaymentFormInput,
  makePaymentFormSchema,
} from "./make-payment.schema";

const _defaultValues = {};

type MakePaymentFormProps = {
  className?: string;
};
export function MakePaymentForm({ className }: MakePaymentFormProps) {
  const { t } = useLocale();
  const [isLoading, setLoading] = useState(false);
  const { createQueryString } = useCreateQueryString();

  const methods = useForm<MakePaymentFormInput>({
    resolver: zodResolver(makePaymentFormSchema),
    defaultValues: _defaultValues,
  });

  const onSubmit: SubmitHandler<MakePaymentFormInput> = (data) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log("make payment form input", data);
      toast.success(<p>Make payment successfull</p>);
      methods.reset();
    }, 1500);
  };

  const router = useRouter();
  return (
    <div className="@container">
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <FormFooter
            isLoading={isLoading}
            handleAltBtn={() => {
              methods.reset();
              router.push(
                `${routes.students.index}/?` +
                  createQueryString({ tab: "finances", make_payment: "" }),
              );
            }}
            submitBtnText={t("make_payment")}
            altBtnText={t("cancel")}
          />
        </form>
      </Form>
    </div>
  );
}
