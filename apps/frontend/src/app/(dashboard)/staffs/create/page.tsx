"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

import PrefixSelector from "~/components/shared/forms/PrefixSelector";
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
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";

export default function PersonnelCreatePage() {
  const [autoGenerateEmail, setAutoGenerateEmail] = useState(false);
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-4 p-4">
      <Card className="bg-accent text-accent-foreground">
        <CardHeader>
          <CardTitle>Créer un personnel</CardTitle>
          <CardDescription>
            Veuillez vérifier si le personnel n'existe pas déjà
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <InputGroup>
              <InputGroupInput placeholder={t("search")} />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>
            <Button>{t("search")}</Button>
          </div>
        </CardContent>
      </Card>

      <form className="space-y-2">
        <Accordion
          type="multiple"
          defaultValue={["personal", "professional", "contractual"]}
          className="w-full space-y-4 border-0"
        >
          {/* Personal Information Section */}
          <AccordionItem
            value="personal"
            className="bg-card border-border overflow-hidden rounded-lg border"
          >
            <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
              Informations Personnelles
            </AccordionTrigger>
            <AccordionContent className="border-border grid gap-4 border-t p-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-start gap-2">
                <div className="w-[75px] space-y-2">
                  <Label>Prefix</Label>
                  <PrefixSelector className="w-[75px]" />
                </div>
                <div className="w-full space-y-2">
                  <Label htmlFor="nom">
                    Nom <span className="text-destructive">*</span>
                  </Label>
                  <Input id="nom" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input id="prenom" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateNaissance">
                  Date de naissance <span className="text-destructive">*</span>
                </Label>
                <Input id="dateNaissance" type="date" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lieuNaissance">
                  Lieu de naissance <span className="text-destructive">*</span>
                </Label>
                <Input id="lieuNaissance" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sexe">
                  Sexe <span className="text-destructive">*</span>
                </Label>
                <Select required>
                  <SelectTrigger id="sexe" className="w-full">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculin">Masculin</SelectItem>
                    <SelectItem value="feminin">Féminin</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephone">
                  Téléphone <span className="text-destructive">*</span>
                </Label>
                <Input id="telephone" type="tel" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationalite">Nationalité</Label>
                <Input id="nationalite" defaultValue="Congolaise" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@kelasi.com"
                  disabled={autoGenerateEmail}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adresse">Adresse</Label>
                <Input id="adresse" />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Contract Information Section */}
          <AccordionItem
            value="contractual"
            className="bg-card border-border overflow-hidden rounded-lg border"
          >
            <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
              Informations Contractuelles
            </AccordionTrigger>

            <AccordionContent className="border-border grid gap-4 border-t p-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="dateEmbauche">
                  Date d&apos;embauche{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input id="dateEmbauche" type="date" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFinContrat">Date de fin de contrat</Label>
                <Input id="dateFinContrat" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="typePersonnel">
                  Type de Personnel <span className="text-destructive">*</span>
                </Label>
                <Select required>
                  <SelectTrigger id="typePersonnel" className="w-full">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enseignant">Enseignant</SelectItem>
                    <SelectItem value="administratif">Administratif</SelectItem>
                    <SelectItem value="technique">Technique</SelectItem>
                    <SelectItem value="direction">Direction</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="typeContrat">
                  Type de contrat <span className="text-destructive">*</span>
                </Label>
                <Select required>
                  <SelectTrigger id="typeContrat" className="w-full">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cdi">
                      CDI (Contrat à Durée Indéterminée)
                    </SelectItem>
                    <SelectItem value="cdd">
                      CDD (Contrat à Durée Déterminée)
                    </SelectItem>
                    <SelectItem value="stage">Stage</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="poste">Poste</Label>
                <Input
                  id="poste"
                  placeholder="Ex: Principal, Directrice des Études, Comptable..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialite">Spécialité</Label>
                <Input
                  id="specialite"
                  placeholder="Ex: Maths/Phys, Francais/Philo ..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heuresTravail">Heures de travail/semaine</Label>
                <Input
                  id="heuresTravail"
                  type="number"
                  defaultValue="40"
                  min="1"
                  max="168"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          {/** Gestion des Salaires et Allocations */}
          <AccordionItem
            value="allocations"
            className="bg-card border-border overflow-hidden rounded-lg border"
          >
            <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
              Gestion des Salaires et Allocations
            </AccordionTrigger>
            <AccordionContent className="border-border grid gap-4 border-t p-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="salaireDeBase">Salaire de Base</Label>
                <Input id="salaireDeBase" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allocationDeplacement">
                  Allocation Deplacement
                </Label>
                <Input id="allocationDeplacement" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allocationTelephone">
                  Allocation Telephone
                </Label>
                <Input id="allocationTelephone" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alocationLogement">Allocation Logement</Label>
                <Input id="alocationLogement" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allocationTransport">
                  Allocation Transport
                </Label>
                <Input id="allocationTransport" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primePerformamce">Prime de performance</Label>
                <Input id="primePerformamce" />
              </div>
              <div className="bg-primary text-primary-foreground col-span-full grid grid-cols-3 rounded-lg p-2">
                <div>Salaire total calculé : </div>
                <div>Mensuel : 0 FCFA </div>
                <div>Annuel : 0 FCFA</div>
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* * Informations Bancaires */}
          <AccordionItem
            value="banquesInformation"
            className="bg-card border-border overflow-hidden rounded-lg border"
          >
            <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
              Informations Bancaires
            </AccordionTrigger>
            <AccordionContent className="border-border grid gap-4 border-t p-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="banque">Banque</Label>
                <Input id="banque" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="Numerocompte">Numéro de compte</Label>
                <Input id="Numerocompte" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="codebanque">Code banque</Label>
                <Input id="codebanque" />
              </div>
              <Separator className="col-span-full" />
              <div className="space-y-2">
                <Label htmlFor="cnps">Numéro CNPS</Label>
                <Input id="cnps" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnss">Numéro CNSS</Label>
                <Input id="cnss" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="impot"> Numéro d'impôt</Label>
                <Input id="impot" />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Annuler
          </Button>
          <Button type="submit">{t("add")}</Button>
        </div>
      </form>
    </div>
  );
}
