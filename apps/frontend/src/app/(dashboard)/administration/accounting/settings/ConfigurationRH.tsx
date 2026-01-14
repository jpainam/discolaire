/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useForm } from "@tanstack/react-form";
import z from "zod";

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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { ContractHiring } from "./rh/ContractHiring";
import { SalaryCompensation } from "./rh/SalaryCompensation";
import { SocialSecurityContribution } from "./rh/SocialSecurityContributions";

const formSchema = z.object({});
export function ConfigurationRH() {
  const form = useForm({
    defaultValues: {},
    // validators: {
    //   onSubmit: formSchema,
    // },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <div className="grid grid-cols-2 gap-6">
      <ContractHiring />
      <AllocationCard />
      <SalaryCompensation />
      <Card>
        <CardHeader>
          <CardTitle>Salaires et Rémunération</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Congés et Absences</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
      <SocialSecurityContribution />
      <Card>
        <CardHeader>
          <CardTitle>Évaluations et Formations</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
}

function AllocationCard() {
  const form = useForm();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Allocations</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup className="grid grid-cols-2 gap-4">
          <form.Field
            name="title"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Allocation de déplacement par défaut
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    //value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Montant"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="title"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Allocation de téléphone par défaut
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    //value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Montant"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </FieldGroup>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}
