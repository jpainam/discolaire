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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";

const formSchema = z.object({
  housingAllowance: z.coerce.number().min(0),
  transportAllowance: z.coerce.number().min(0),
  performanceBonus: z.coerce.number().min(0),
  autoCalculateSalary: z.coerce.boolean(),
  payrollDay: z.coerce.number().int().min(1).max(31),
  paymentMode: z.enum(["virement", "cheque", "espece", "mobile_money"]),
});

export function SalaryCompensation() {
  const form = useForm({
    defaultValues: {
      housingAllowance: 0,
      transportAllowance: 0,
      performanceBonus: 0,
      autoCalculateSalary: true,
      payrollDay: 1,
      paymentMode: "virement",
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
      console.log("Salary compensation settings:", parsed.data);
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
          <CardTitle>Salaires et Rémunération</CardTitle>
          <CardDescription>
            Paramétrez les allocations et le paiement des salaires.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <form.Field
              name="housingAllowance"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-xs/relaxed font-medium"
                    >
                      Allocation de logement par défaut
                    </FieldLabel>
                    <FieldDescription>
                      Montant attribué par défaut.
                    </FieldDescription>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min={0}
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
              name="transportAllowance"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-xs/relaxed font-medium"
                    >
                      Allocation de transport par défaut
                    </FieldLabel>
                    <FieldDescription>
                      Montant attribué par défaut.
                    </FieldDescription>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min={0}
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
              name="performanceBonus"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-xs/relaxed font-medium"
                    >
                      Prime de performance par défaut
                    </FieldLabel>
                    <FieldDescription>
                      Montant attribué par défaut.
                    </FieldDescription>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min={0}
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
              name="payrollDay"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-xs/relaxed font-medium"
                    >
                      Jour du mois pour le paiement des salaires
                    </FieldLabel>
                    <FieldDescription>Entre 1 et 31.</FieldDescription>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min={1}
                      max={31}
                      step="1"
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
              name="paymentMode"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-xs/relaxed font-medium"
                    >
                      Mode de paiement par défaut pour les salaires
                    </FieldLabel>
                    <FieldDescription>
                      Choisissez la méthode de paiement.
                    </FieldDescription>
                    <Select
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                        <SelectValue placeholder="Sélectionner un mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="virement">Virement</SelectItem>
                        <SelectItem value="cheque">Chèque</SelectItem>
                        <SelectItem value="espece">Espèce</SelectItem>
                        <SelectItem value="mobile_money">
                          Mobile money
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="autoCalculateSalary"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field
                    data-invalid={isInvalid}
                    className="flex flex-row items-center justify-between gap-4 rounded-md border p-3"
                  >
                    <div className="flex flex-col gap-1">
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-xs/relaxed font-medium"
                      >
                        Calculer automatiquement le salaire
                      </FieldLabel>
                      <FieldDescription>
                        Base + allocations appliquées automatiquement.
                      </FieldDescription>
                    </div>
                    <Switch
                      id={field.name}
                      checked={Boolean(field.state.value)}
                      onCheckedChange={(checked) => field.handleChange(checked)}
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
        <CardFooter className="bg-muted/50 border-t px-4 py-3">
          <div className="ml-auto flex items-center">
            <Button type="submit">Enregistrer</Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
