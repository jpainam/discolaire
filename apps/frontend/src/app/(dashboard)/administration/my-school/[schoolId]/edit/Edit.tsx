"use client";

import { toast } from "sonner";
import * as z from "zod";

import type { School } from "@repo/db";
import { useRouter } from "@repo/hooks/use-router";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Form, useForm } from "@repo/ui/form";

import { api } from "~/trpc/react";
import { CreateEditSchoolForm } from "../../CreateEditSchoolForm";

const formSchema = z.object({
  name: z.string().min(1),
  authorization: z.string().optional(),
  ministry: z.string().optional(),
  department: z.string().optional(),
  address: z.string().optional(),
  region: z.string().optional(),
  city: z.string().optional(),
  headmaster: z.string().optional(),
  phoneNumber1: z.string().optional(),
  phoneNumber2: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  logo: z.string().optional(),
  isActive: z.boolean().default(true),
});

export default function Edit({ school }: { school: School }) {
  const { t } = useLocale();
  const utils = api.useUtils();
  const router = useRouter();

  const updateSchoolMutation = api.school.update.useMutation({
    onSettled: () => utils.school.all.invalidate(),
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
      router.push("/administration/my-school");
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

  const form = useForm({
    schema: formSchema,
    defaultValues: {
      name: school.name,
      authorization: school.authorization ?? "",
      ministry: school.ministry ?? "",
      department: school.department ?? "",
      address: school.address ?? "",
      region: school.region ?? "",
      city: school.city ?? "",
      headmaster: school.headmaster ?? "",
      phoneNumber1: school.phoneNumber1 ?? "",
      phoneNumber2: school.phoneNumber2 ?? "",
      email: school.email ?? "",
      website: school.website ?? "",
      isActive: school.isActive,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast.loading(t("updating"), { id: 0 });
    updateSchoolMutation.mutate({ id: school.id, ...data });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto grid max-w-3xl grid-cols-1 gap-x-8 gap-y-2 pt-8 md:grid-cols-2"
      >
        <CreateEditSchoolForm />
        <Button isLoading={updateSchoolMutation.isPending} type="submit">
          {t("submit")}
        </Button>
      </form>
    </Form>
  );
}
