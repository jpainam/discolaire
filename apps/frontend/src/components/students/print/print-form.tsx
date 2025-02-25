"use client";

import { z } from "zod";

import { useCreateQueryString } from "@repo/hooks/create-query-string";
import { Button } from "@repo/ui/components/button";
import { Form, useForm } from "@repo/ui/components/form";
import { useLocale } from "~/i18n";

import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import PrintSelector from "./print-selector";
import PrintTypeRadio from "./print-type-radio";

// type PrintStart =
//   | "Maintenant"
//   | "En soirée"
//   | "Demain matin"
//   | "En fin de semaine"
//   | "Personnalisé";
const printFormSchema = z.object({
  type: z.enum(["pdf", "excel"], {
    required_error: "Veuillez choisir un type d'impression",
  }),
  date: z.date().optional(),
  print: z.string({ required_error: "Veuillez choisir un rapport" }),
  school_year: z.string({
    required_error: "Veuillez choisir une année scolaire",
  }),
  start: z.enum([
    "Maintenant",
    "En soirée",
    "Demain matin",
    "En fin de semaine",
    "Personnalisé",
  ]),
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
});

type PrintFormValues = z.infer<typeof printFormSchema>;

export default function PrintForm() {
  //const schoolYearId = useSchoolYear();
  const { t } = useLocale();

  const form = useForm({
    schema: printFormSchema,
    defaultValues: {
      type: "pdf",
      date: new Date(),
      start: "Maintenant",
      school_year: "2022-2023",
    },
  });
  const router = useRouter();

  const { createQueryString } = useCreateQueryString();
  const onSubmit = (data: PrintFormValues) => {
    const query = {
      ...data,
      date: data.date?.toISOString(),
      start_date: data.start_date?.toISOString(),
      end_date: data.end_date?.toISOString(),
    };
    router.push(routes.reports.index + "/?" + createQueryString(query));
  };
  return (
    <div className="p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid w-full grid-cols-1 gap-4 md:w-[60%] md:grid-cols-2"
        >
          <PrintTypeRadio />
          <PrintSelector />

          {/*<PrintStartSelector form={form} />*/}
          {/* <PrintStartEndDateSelector /> */}
          <div className="col-span-1 col-start-2 flex gap-5">
            <Button type="reset" variant={"outline"} className="h-8 w-auto">
              {t("cancel")}
            </Button>
            <Button type="submit" className="h-8 w-auto">
              {t("print")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
