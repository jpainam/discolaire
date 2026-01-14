"use client";

import { useForm } from "@tanstack/react-form";
import z from "zod";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";

const formSchema = z.object({
  employeeCnpsRate: z.coerce.number().min(0).max(100),
  employeeCnssRate: z.coerce.number().min(0).max(100),
  employerCnpsRate: z.coerce.number().min(0).max(100),
  employerCnssRate: z.coerce.number().min(0).max(100),
});

export function SocialSecurityContribution() {
  const form = useForm({
    defaultValues: {
      employeeCnpsRate: 0,
      employeeCnssRate: 0,
      employerCnpsRate: 0,
      employerCnssRate: 0,
    },
    validators: {
      onSubmit: ({ value }) => {
        const parsed = formSchema.safeParse(value);
        if (!parsed.success) {
          return { error: parsed.error.flatten().fieldErrors };
        }
      },
    },
    onSubmit: ({ value }) => {
      const parsed = formSchema.safeParse(value);
      if (!parsed.success) {
        return;
      }
      console.log("Social security contributions:", parsed.data);
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <Card className="pb-0">
        <CardHeader>
          <CardTitle>Cotisations sociales</CardTitle>
          <CardDescription>
            Définissez les taux appliqués aux employés et employeurs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <form.Field
              name="employeeCnpsRate"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-xs/relaxed font-medium"
                    >
                      Cotisation CNPS à la charge de l'employé (en %)
                    </FieldLabel>
                    <FieldDescription>
                      Taux valeur en pourcentage.
                    </FieldDescription>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min={0}
                      max={100}
                      step="0.01"
                      value={Number(field.state.value)}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(Number(event.target.value))
                      }
                      aria-invalid={isInvalid}
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="employeeCnssRate"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-xs/relaxed font-medium"
                    >
                      Cotisation CNSS à la charge de l'employé (en %)
                    </FieldLabel>
                    <FieldDescription>
                      Taux valeur en pourcentage.
                    </FieldDescription>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min={0}
                      max={100}
                      step="0.01"
                      value={Number(field.state.value)}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(Number(event.target.value))
                      }
                      aria-invalid={isInvalid}
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="employerCnpsRate"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-xs/relaxed font-medium"
                    >
                      Cotisation CNPS à la charge de l'employeur (en %)
                    </FieldLabel>
                    <FieldDescription>
                      Taux valeur en pourcentage.
                    </FieldDescription>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min={0}
                      max={100}
                      step="0.01"
                      value={Number(field.state.value)}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(Number(event.target.value))
                      }
                      aria-invalid={isInvalid}
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="employerCnssRate"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-xs/relaxed font-medium"
                    >
                      Cotisation CNSS à la charge de l'employeur (en %)
                    </FieldLabel>
                    <FieldDescription>
                      Taux valeur en pourcentage.
                    </FieldDescription>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min={0}
                      max={100}
                      step="0.01"
                      value={Number(field.state.value)}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(Number(event.target.value))
                      }
                      aria-invalid={isInvalid}
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter className="bg-muted/50 justify-end border-t px-4 py-3">
          <Button type="submit">Enregistrer</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
