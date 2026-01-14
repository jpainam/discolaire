/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, useStore } from "@tanstack/react-form";
import { ArrowLeft, Calculator, HelpCircle, Square } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Table, TableBody, TableCell, TableRow } from "~/components/ui/table";
import { Textarea } from "~/components/ui/textarea";

export default function NouveauPaiementPage() {
  const [showBeneficiaryDetails, setShowBeneficiaryDetails] = useState(false);
  const [calculatedDeductions, setCalculatedDeductions] = useState<{
    cnps: number;
    cnss: number;
    total: number;
    net: number;
  } | null>(null);
  const form = useForm({
    defaultValues: {
      beneficiaryType: "enseignant",
      beneficiary: "bisseck",
      month: "janvier",
      year: "2026",
      grossSalary: "",
      advance: "",
      otherDeductions: "",
      paymentMode: "virement",
      paymentDate: "",
      paymentReference: "",
      bankName: "",
      observations: "",
    },
  });
  const selectedBeneficiary = useStore(
    form.store,
    (state) => state.values.beneficiary,
  );
  const grossSalary = useStore(form.store, (state) => state.values.grossSalary);
  const advance = useStore(form.store, (state) => state.values.advance);
  const otherDeductions = useStore(
    form.store,
    (state) => state.values.otherDeductions,
  );

  const beneficiaryDetails = {
    matricule: "ENS4877",
    telephone: "077491496",
    banque: "N/A",
  };

  const handleCalculate = () => {
    const gross = Number.parseFloat(grossSalary) || 0;
    const cnps = gross * 0.04;
    const cnss = gross * 0.01;
    const adv = Number.parseFloat(advance) || 0;
    const other = Number.parseFloat(otherDeductions) || 0;
    const total = cnps + cnss + adv + other;
    const net = gross - total;

    setCalculatedDeductions({
      cnps,
      cnss,
      total,
      net,
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Square className="text-primary h-5 w-5" />
            <h1 className="text-primary text-2xl font-semibold">
              Nouveau Paiement de Salaire
            </h1>
          </div>
          <nav className="text-muted-foreground flex items-center gap-2 text-sm">
            <span>Accueil</span>
            <span>/</span>
            <span>Finances</span>
            <span>/</span>
            <span>Paiements Salaires</span>
            <span>/</span>
            <span className="text-foreground">Nouveau</span>
          </nav>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 bg-transparent">
            <HelpCircle className="h-4 w-4" />
            Aide
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Link>
          </Button>
        </div>
      </div>
      <Accordion type="single" defaultValue="item-1" className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
            <Square className="size-4" />
            Paramètres Configurables Appliqués
          </AccordionTrigger>

          <AccordionContent>
            <div className="grid grid-cols-4 pb-0">
              <div className="flex items-center gap-2">
                <Square className="h-3 w-3" />
                <span>CNPS employé : 4%</span>
              </div>
              <div className="flex items-center gap-2">
                <Square className="h-3 w-3" />
                <span>CNSS employé : 1%</span>
              </div>
              <div className="flex items-center gap-2">
                <Square className="h-3 w-3" />
                <span>Mode paiement : Virement</span>
              </div>
              <div className="flex items-center gap-2">
                <Square className="h-3 w-3" />
                <span>Jour paiement : Le 5 du mois</span>
              </div>
            </div>

            <div>
              <Square className="mr-2 inline h-3 w-3" />
              Ces taux sont configurables dans{" "}
              <a href="#" className="text-primary font-medium hover:underline">
                Administration → Configurations RH
              </a>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
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
                    name="beneficiary"
                    children={(field) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>
                          Bénéficiaire
                        </FieldLabel>
                        <StaffSelector
                          onSelect={(val) => field.handleChange(val)}
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
                          onValueChange={(value) => field.handleChange(value)}
                        >
                          <SelectTrigger id={field.name}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="janvier">Janvier</SelectItem>
                            <SelectItem value="fevrier">Février</SelectItem>
                            <SelectItem value="mars">Mars</SelectItem>
                            <SelectItem value="avril">Avril</SelectItem>
                            <SelectItem value="mai">Mai</SelectItem>
                            <SelectItem value="juin">Juin</SelectItem>
                            <SelectItem value="juillet">Juillet</SelectItem>
                            <SelectItem value="aout">Août</SelectItem>
                            <SelectItem value="septembre">Septembre</SelectItem>
                            <SelectItem value="octobre">Octobre</SelectItem>
                            <SelectItem value="novembre">Novembre</SelectItem>
                            <SelectItem value="decembre">Décembre</SelectItem>
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
                          onValueChange={(value) => field.handleChange(value)}
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
                          value={field.state.value}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
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
                          value={field.state.value}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
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
                          value={field.state.value}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          placeholder="0"
                        />
                      </Field>
                    )}
                  />
                </FieldGroup>

                <div className="bg-primary text-primary-foreground grid grid-cols-3 gap-4 rounded-lg p-2">
                  <div>Matricule: ENS4877 </div>
                  <div>Téléphone: 077491496 </div>
                  <div>Banque: N/A</div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-blue-500 text-white hover:bg-blue-600"
                  size="lg"
                  onClick={handleCalculate}
                  type="button"
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
                          onValueChange={(value) => field.handleChange(value)}
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
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                        />
                      </Field>
                    )}
                  />

                  <form.Field
                    name="paymentReference"
                    children={(field) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Référence</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="text"
                          value={field.state.value}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          placeholder="N° chèque ou référence"
                        />
                      </Field>
                    )}
                  />

                  <form.Field
                    name="bankName"
                    children={(field) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Banque</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="text"
                          value={field.state.value}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          placeholder="Nom de la banque"
                        />
                      </Field>
                    )}
                  />

                  <form.Field
                    name="observations"
                    children={(field) => (
                      <Field className="md:col-span-2">
                        <FieldLabel htmlFor={field.name}>
                          Observations
                        </FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
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

          {/* Sidebar - Calculation Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="bg-primary text-primary-foreground mb-6 rounded-lg p-4">
                  <h2 className="text-center font-semibold">
                    RÉSUMÉ DU CALCUL
                  </h2>
                </div>

                {!calculatedDeductions ? (
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground text-sm">
                      Remplissez les champs et cliquez sur "Calculer"
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="border-border overflow-hidden rounded-lg border">
                      <Table>
                        <TableBody>
                          <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                            <TableCell className="bg-muted/50 font-medium">
                              Salaire Brut:
                            </TableCell>
                            <TableCell>
                              {Number.parseFloat(grossSalary).toLocaleString()}{" "}
                              FCFA
                            </TableCell>
                          </TableRow>
                          <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                            <TableCell className="bg-muted/50 font-medium">
                              CNPS (4%):
                            </TableCell>
                            <TableCell>
                              {calculatedDeductions.cnps.toLocaleString()} FCFA
                            </TableCell>
                          </TableRow>
                          <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                            <TableCell className="bg-muted/50 font-medium">
                              CNSS (1%):
                            </TableCell>
                            <TableCell>
                              {calculatedDeductions.cnss.toLocaleString()} FCFA
                            </TableCell>
                          </TableRow>
                          {Number.parseFloat(advance) > 0 && (
                            <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                              <TableCell className="bg-muted/50 font-medium">
                                Avance:
                              </TableCell>
                              <TableCell className="font-medium text-red-500">
                                {Number.parseFloat(advance).toLocaleString()}{" "}
                                FCFA
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="space-y-3">
                      <div className="border-border overflow-hidden rounded-lg border">
                        <Table>
                          <TableBody>
                            {Number.parseFloat(otherDeductions) > 0 && (
                              <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                                <TableCell className="bg-muted/50 font-medium">
                                  Autres déductions:
                                </TableCell>
                                <TableCell className="font-medium text-red-500">
                                  {Number.parseFloat(
                                    otherDeductions,
                                  ).toLocaleString()}{" "}
                                  FCFA
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                      {Number.parseFloat(otherDeductions) > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Autres déductions:
                          </span>
                          <span className="font-medium text-red-500">
                            {Number.parseFloat(
                              otherDeductions,
                            ).toLocaleString()}{" "}
                            FCFA
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between border-t pt-3 text-sm">
                        <span className="text-muted-foreground">
                          Total déductions:
                        </span>
                        <span className="font-medium text-red-500">
                          {calculatedDeductions.total.toLocaleString()} FCFA
                        </span>
                      </div>
                    </div>

                    <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
                      <div className="text-center">
                        <p className="text-muted-foreground mb-2 text-sm">
                          Net à Payer
                        </p>
                        <p className="text-3xl font-bold text-green-600">
                          {calculatedDeductions.net.toLocaleString()}
                        </p>
                        <p className="text-muted-foreground mt-1 text-sm">
                          FCFA
                        </p>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-green-500 text-white hover:bg-green-600"
                      size="lg"
                      type="button"
                    >
                      <Square className="mr-2 h-4 w-4" />
                      Enregistrer le Paiement
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button className="w-full">Enregistrer le paiment</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
