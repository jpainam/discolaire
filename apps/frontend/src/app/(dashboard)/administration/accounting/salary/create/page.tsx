"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useStore } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calculator,
  CheckCircle,
  HelpCircle,
  Info,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { BreadcrumbsSetter } from "~/components/BreadcrumbsSetter";
import { StaffSelector } from "~/components/shared/selects/StaffSelector";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Table, TableBody, TableCell, TableRow } from "~/components/ui/table";
import { Textarea } from "~/components/ui/textarea";
import { useTRPC } from "~/trpc/react";

const CNPS_RATE = 0.04;
const CNSS_RATE = 0.01;

export default function NouveauPaiementPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const t = useTranslations();

  const [calculatedDeductions, setCalculatedDeductions] = useState<{
    cnps: number;
    cnss: number;
    advance: number;
    other: number;
    total: number;
    net: number;
  } | null>(null);

  // Fetch selected staff to show bank/contact details
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const staffQuery = useQuery(trpc.staff.all.queryOptions({ limit: 300 }));
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];
  const selectedStaff = staffQuery.data?.find((s) => s.id === selectedStaffId);

  const createPayroll = useMutation(
    trpc.payroll.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.payroll.pathFilter());
        toast.success("Paiement enregistré avec succès");
        router.push("/administration/accounting/salary");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const form = useForm({
    defaultValues: {
      staffId: "",
      month: "january",
      year: new Date().getFullYear().toString(),
      grossSalary: "",
      advance: "",
      otherDeductions: "",
      paymentMode: "virement",
      paymentDate: "",
      observations: "",
    },
  });

  const grossSalary = useStore(form.store, (s) => s.values.grossSalary);
  const advance = useStore(form.store, (s) => s.values.advance);
  const otherDeductions = useStore(form.store, (s) => s.values.otherDeductions);
  const month = useStore(form.store, (s) => s.values.month);
  const year = useStore(form.store, (s) => s.values.year);

  function handleCalculate() {
    const gross = Number.parseFloat(grossSalary) || 0;
    if (gross <= 0) {
      toast.error("Veuillez saisir un salaire brut valide");
      return;
    }
    const cnps = gross * CNPS_RATE;
    const cnss = gross * CNSS_RATE;
    const adv = Number.parseFloat(advance) || 0;
    const other = Number.parseFloat(otherDeductions) || 0;
    const total = cnps + cnss + adv + other;
    const net = gross - total;
    setCalculatedDeductions({ cnps, cnss, advance: adv, other, total, net });
  }

  function handleSave() {
    const values = form.state.values;

    if (!values.staffId) {
      toast.error("Veuillez sélectionner un bénéficiaire");
      return;
    }
    if (!calculatedDeductions) {
      toast.error("Veuillez d'abord calculer les déductions");
      return;
    }

    const monthIndex = months.indexOf(values.month);
    const yearNum = Number.parseInt(values.year, 10);
    const period = new Date(yearNum, monthIndex, 1);

    createPayroll.mutate({
      staffId: values.staffId,
      period,
      baseSalary: Number.parseFloat(values.grossSalary),
      deductions: calculatedDeductions.total,
      netSalary: calculatedDeductions.net,
      method: values.paymentMode.toUpperCase(),
      observation: values.observations || undefined,
    });
  }

  const fmt = (n: number) => n.toLocaleString("fr-FR");

  return (
    <div className="flex flex-col gap-4 p-4">
      <BreadcrumbsSetter
        items={[
          { label: t("administration"), href: "/administration" },
          { label: t("Finances"), href: "/administration/accounting" },
          {
            label: t("Salary & Payroll"),
            href: "/administration/accounting/salary",
          },
          { label: t("create") },
        ]}
      />
      <div className="flex items-center justify-between">
        <Label>Création d&apos;un nouveau paiement</Label>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 bg-transparent">
            <HelpCircle className="h-4 w-4" />
            Aide
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent" asChild>
            <Link href="/administration/accounting/salary">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Link>
          </Button>
        </div>
      </div>

      <Accordion type="single" defaultValue="item-1" className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
            <Info className="size-4" />
            Paramètres Configurables Appliqués
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-4 pb-0">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>CNPS employé : {CNPS_RATE * 100}%</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>CNSS employé : {CNSS_RATE * 100}%</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Mode paiement : Virement</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Jour paiement : Le 5 du mois</span>
              </div>
            </div>
            <div className="mt-2 text-sm">
              <CheckCircle className="mr-2 inline h-3 w-3 text-green-500" />
              Ces taux sont configurables dans{" "}
              <a href="#" className="text-primary font-medium hover:underline">
                Administration → Configurations RH
              </a>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informations du bénéficiaire</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <form.Field
                  name="staffId"
                  children={(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Bénéficiaire <span className="text-red-500">*</span>
                      </FieldLabel>
                      <StaffSelector
                        onSelect={(id) => {
                          field.handleChange(id);
                          setSelectedStaffId(id);
                        }}
                      />
                    </Field>
                  )}
                />
                <form.Field
                  name="month"
                  children={(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Mois <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={(v) => field.handleChange(v)}
                      >
                        <SelectTrigger id={field.name}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((m) => (
                            <SelectItem key={m} value={m}>
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
                <form.Field
                  name="year"
                  children={(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Année <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={(v) => field.handleChange(v)}
                      >
                        <SelectTrigger id={field.name}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2025">2025</SelectItem>
                          <SelectItem value="2026">2026</SelectItem>
                          <SelectItem value="2027">2027</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
              </FieldGroup>

              <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <form.Field
                  name="grossSalary"
                  children={(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Salaire Brut <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        min={0}
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                          setCalculatedDeductions(null);
                        }}
                        placeholder="0"
                      />
                    </Field>
                  )}
                />
                <form.Field
                  name="advance"
                  children={(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Avance sur salaire
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        min={0}
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                          setCalculatedDeductions(null);
                        }}
                        placeholder="0"
                      />
                    </Field>
                  )}
                />
                <form.Field
                  name="otherDeductions"
                  children={(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Autres déductions
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        min={0}
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                          setCalculatedDeductions(null);
                        }}
                        placeholder="0"
                      />
                    </Field>
                  )}
                />
              </FieldGroup>

              {/* Staff quick-info strip */}
              {selectedStaff ? (
                <div className="bg-primary text-primary-foreground grid grid-cols-3 gap-4 rounded-lg p-2 text-sm">
                  <div>
                    Poste:{" "}
                    <span className="font-medium">
                      {selectedStaff.jobTitle ?? "—"}
                    </span>
                  </div>
                  <div>
                    Tél:{" "}
                    <span className="font-medium">
                      {selectedStaff.phoneNumber1 ?? "—"}
                    </span>
                  </div>
                  <div>
                    Banque:{" "}
                    <span className="font-medium">
                      {selectedStaff.bankName ?? "—"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-muted text-muted-foreground rounded-lg p-2 text-center text-sm">
                  Sélectionnez un bénéficiaire pour afficher ses informations
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-blue-500 text-white hover:bg-blue-600"
                size="lg"
                type="button"
                onClick={handleCalculate}
              >
                <Calculator className="mr-2 h-4 w-4" />
                Calculer les déductions
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations de Paiement</CardTitle>
              <CardDescription>
                Renseignez le mode de paiement et les informations associées.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <form.Field
                  name="paymentMode"
                  children={(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Mode de paiement
                      </FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={(v) => field.handleChange(v)}
                      >
                        <SelectTrigger id={field.name}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="virement">
                            Virement bancaire
                          </SelectItem>
                          <SelectItem value="espece">Espèces</SelectItem>
                          <SelectItem value="cheque">Chèque</SelectItem>
                          <SelectItem value="mobile_money">
                            Mobile Money
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
                <form.Field
                  name="paymentDate"
                  children={(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Date de paiement
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="date"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </Field>
                  )}
                />
                <form.Field
                  name="observations"
                  children={(field) => (
                    <Field className="md:col-span-2">
                      <FieldLabel htmlFor={field.name}>Observations</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Ajouter un commentaire ou une précision"
                      />
                    </Field>
                  )}
                />
              </FieldGroup>
            </CardContent>
            <CardFooter>
              <p className="text-muted-foreground text-xs">
                Ces informations apparaîtront sur le reçu de paiement.
              </p>
            </CardFooter>
          </Card>
        </div>

        {/* Sidebar – Calculation Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="p-6">
              <div className="bg-primary text-primary-foreground mb-6 rounded-lg p-4">
                <h2 className="text-center font-semibold">RÉSUMÉ DU CALCUL</h2>
                {month && year && (
                  <p className="mt-1 text-center text-xs capitalize opacity-80">
                    {month} {year}
                  </p>
                )}
              </div>

              {!calculatedDeductions ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground text-sm">
                    Remplissez les champs et cliquez sur &quot;Calculer&quot;
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="border-border overflow-hidden rounded-lg border">
                    <Table>
                      <TableBody>
                        <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                          <TableCell className="bg-muted/50 font-medium">
                            Salaire Brut
                          </TableCell>
                          <TableCell>
                            {fmt(Number.parseFloat(grossSalary))} FCFA
                          </TableCell>
                        </TableRow>
                        <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                          <TableCell className="bg-muted/50 font-medium">
                            CNPS ({CNPS_RATE * 100}%)
                          </TableCell>
                          <TableCell className="text-red-500">
                            -{fmt(calculatedDeductions.cnps)} FCFA
                          </TableCell>
                        </TableRow>
                        <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                          <TableCell className="bg-muted/50 font-medium">
                            CNSS ({CNSS_RATE * 100}%)
                          </TableCell>
                          <TableCell className="text-red-500">
                            -{fmt(calculatedDeductions.cnss)} FCFA
                          </TableCell>
                        </TableRow>
                        {calculatedDeductions.advance > 0 && (
                          <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                            <TableCell className="bg-muted/50 font-medium">
                              Avance
                            </TableCell>
                            <TableCell className="text-red-500">
                              -{fmt(calculatedDeductions.advance)} FCFA
                            </TableCell>
                          </TableRow>
                        )}
                        {calculatedDeductions.other > 0 && (
                          <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                            <TableCell className="bg-muted/50 font-medium">
                              Autres déductions
                            </TableCell>
                            <TableCell className="text-red-500">
                              -{fmt(calculatedDeductions.other)} FCFA
                            </TableCell>
                          </TableRow>
                        )}
                        <TableRow className="*:border-border bg-muted/50 hover:bg-transparent [&>:not(:last-child)]:border-r">
                          <TableCell className="font-semibold">
                            Total déductions
                          </TableCell>
                          <TableCell className="font-semibold text-red-500">
                            -{fmt(calculatedDeductions.total)} FCFA
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-2 text-sm">
                        Net à Payer
                      </p>
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {fmt(calculatedDeductions.net)}
                      </p>
                      <p className="text-muted-foreground mt-1 text-sm">FCFA</p>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-green-500 text-white hover:bg-green-600"
                    size="lg"
                    type="button"
                    disabled={createPayroll.isPending}
                    onClick={handleSave}
                  >
                    {createPayroll.isPending ? (
                      "Enregistrement..."
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Enregistrer le Paiement
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
