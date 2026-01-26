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
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "~/components/ui/combobox";
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

const documentOptions = [
  "cv",
  "diplomes",
  "casier_judiciaire",
  "certificat_medical",
] as const;

const formSchema = z.object({
  employmentTypeId: z.string().min(1),
  probationPeriodDays: z.coerce.number().int().min(0),
  notifyCddEndDays: z.coerce.number().int().min(0),
  autoRenewCddDays: z.coerce.number().int().min(0),
  staffStatus: z.enum(["active"]),
  requiredDocuments: z.array(z.enum(documentOptions)),
});

export function ContractHiring() {
  const anchor = useComboboxAnchor();
  const form = useForm({
    defaultValues: {
      employmentTypeId: "",
      probationPeriodDays: 0,
      notifyCddEndDays: 0,
      autoRenewCddDays: 0,
      staffStatus: "active",
      requiredDocuments: [] as string[],
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
      console.log("Contract hiring settings:", parsed.data);
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
          <CardTitle>Contrats et Embauche</CardTitle>
          <CardDescription>
            Paramétrez les règles de contrat et les documents requis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <form.Field
              name="employmentTypeId"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-xs/relaxed font-medium"
                    >
                      Type de contrat par défaut
                    </FieldLabel>
                    <FieldDescription>
                      Choisissez le type appliqué par défaut.
                    </FieldDescription>
                    {/* <EmploymentTypeSelector
                      onSelectAction={(value) =>
                        field.handleChange(value ?? "")
                      }
                    /> */}
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="probationPeriodDays"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-xs/relaxed font-medium"
                    >
                      Durée de la période d'essai en jours
                    </FieldLabel>
                    <FieldDescription>
                      Saisissez un nombre de jours.
                    </FieldDescription>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min={0}
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
              name="notifyCddEndDays"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-xs/relaxed font-medium"
                    >
                      Notifier X jours avant la fin d'un CDD
                    </FieldLabel>
                    <FieldDescription>
                      Définissez le délai de notification.
                    </FieldDescription>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min={0}
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
              name="autoRenewCddDays"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-xs/relaxed font-medium"
                    >
                      Proposer automatiquement le renouvellement des CDD
                    </FieldLabel>
                    <FieldDescription>
                      Délai en jours avant la fin du CDD.
                    </FieldDescription>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min={0}
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
              name="staffStatus"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-xs/relaxed font-medium"
                    >
                      Statut par défaut du personnel
                    </FieldLabel>
                    <FieldDescription>
                      Statut attribué à l'embauche.
                    </FieldDescription>
                    <Select
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Actif</SelectItem>
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
              name="requiredDocuments"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-xs/relaxed font-medium"
                    >
                      Documents requis pour l'embauche
                    </FieldLabel>
                    <FieldDescription>
                      Sélectionnez un ou plusieurs documents.
                    </FieldDescription>
                    <Combobox
                      multiple
                      autoHighlight
                      items={[...documentOptions]}
                      onValueChange={(values) => {
                        field.handleChange(values);
                      }}
                      defaultValue={field.state.value}
                    >
                      <ComboboxChips ref={anchor}>
                        <ComboboxValue>
                          {(values: string[]) => (
                            <div className="flex flex-wrap gap-1">
                              {values.map((value) => (
                                <ComboboxChip key={value}>{value}</ComboboxChip>
                              ))}
                              <ComboboxChipsInput />
                            </div>
                          )}
                        </ComboboxValue>
                      </ComboboxChips>
                      <ComboboxContent anchor={anchor}>
                        <ComboboxEmpty>Aucun document</ComboboxEmpty>
                        <ComboboxList>
                          {(item: string) => (
                            <ComboboxItem key={item} value={item}>
                              {item}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
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
