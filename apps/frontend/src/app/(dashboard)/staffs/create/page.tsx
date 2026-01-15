"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";

export default function PersonnelCreatePage() {
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    professional: true,
    contractual: true,
  });

  const [autoGenerateEmail, setAutoGenerateEmail] = useState(false);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    
      <div className="px-4 py-2">
        <div className="mb-8">
          <h1 className="text-foreground mb-2 text-3xl font-bold">
            Créer un Personnel
          </h1>
          <p className="text-muted-foreground">
            Remplissez les informations du nouveau membre du personnel
          </p>
        </div>

        <form className="space-y-6">
          {/* Personal Information Section */}
          <div className="bg-card border-border overflow-hidden rounded-lg border">
            <button
              type="button"
              onClick={() => toggleSection("personal")}
              className="hover:bg-accent/50 flex w-full items-center gap-3 p-4 text-left transition-colors"
            >
              <div className="flex h-5 w-5 items-center justify-center">
                <div className="border-primary bg-primary/10 h-4 w-4 rounded border-2" />
              </div>
              <span className="text-primary flex-1 text-lg font-semibold">
                Informations Personnelles
              </span>
              {expandedSections.personal ? (
                <ChevronUp className="text-muted-foreground h-5 w-5" />
              ) : (
                <ChevronDown className="text-muted-foreground h-5 w-5" />
              )}
            </button>

            {expandedSections.personal && (
              <div className="border-border space-y-6 border-t p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nom">
                      Nom <span className="text-destructive">*</span>
                    </Label>
                    <Input id="nom" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom</Label>
                    <Input id="prenom" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="dateNaissance">
                      Date de naissance{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input id="dateNaissance" type="date" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lieuNaissance">
                      Lieu de naissance{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input id="lieuNaissance" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sexe">
                      Sexe <span className="text-destructive">*</span>
                    </Label>
                    <Select required>
                      <SelectTrigger id="sexe">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculin">Masculin</SelectItem>
                        <SelectItem value="feminin">Féminin</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                    <Label htmlFor="email">
                      Email{" "}
                      <span className="text-muted-foreground text-sm">
                        (Optionnel - Pour le compte utilisateur)
                      </span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@kelasi.com"
                      disabled={autoGenerateEmail}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="autoEmail"
                    checked={autoGenerateEmail}
                    onCheckedChange={(checked) =>
                      setAutoGenerateEmail(checked === true)
                    }
                  />
                  <label
                    htmlFor="autoEmail"
                    className="text-muted-foreground cursor-pointer text-sm"
                  >
                    Si vide, email auto-généré : matricule@kelasi.local
                  </label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adresse">Adresse</Label>
                  <Textarea id="adresse" rows={4} className="resize-none" />
                </div>
              </div>
            )}
          </div>

          {/* Professional Information Section */}
          <div className="bg-card border-border overflow-hidden rounded-lg border">
            <button
              type="button"
              onClick={() => toggleSection("professional")}
              className="hover:bg-accent/50 flex w-full items-center gap-3 p-4 text-left transition-colors"
            >
              <div className="flex h-5 w-5 items-center justify-center">
                <div className="border-primary bg-primary/10 h-4 w-4 rounded border-2" />
              </div>
              <span className="text-primary flex-1 text-lg font-semibold">
                Informations Professionnelles
              </span>
              {expandedSections.professional ? (
                <ChevronUp className="text-muted-foreground h-5 w-5" />
              ) : (
                <ChevronDown className="text-muted-foreground h-5 w-5" />
              )}
            </button>

            {expandedSections.professional && (
              <div className="border-border space-y-6 border-t p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="typePersonnel">
                      Type de Personnel{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Select required>
                      <SelectTrigger id="typePersonnel">
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enseignant">Enseignant</SelectItem>
                        <SelectItem value="administratif">
                          Administratif
                        </SelectItem>
                        <SelectItem value="technique">Technique</SelectItem>
                        <SelectItem value="direction">Direction</SelectItem>
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
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="specialite">Spécialité</Label>
                    <Input id="specialite" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="statut">
                      Statut <span className="text-destructive">*</span>
                    </Label>
                    <Select required>
                      <SelectTrigger id="statut">
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="permanent">Permanent</SelectItem>
                        <SelectItem value="temporaire">Temporaire</SelectItem>
                        <SelectItem value="contractuel">Contractuel</SelectItem>
                        <SelectItem value="stagiaire">Stagiaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contract Information Section */}
          <div className="bg-card border-border overflow-hidden rounded-lg border">
            <button
              type="button"
              onClick={() => toggleSection("contractual")}
              className="hover:bg-accent/50 flex w-full items-center gap-3 p-4 text-left transition-colors"
            >
              <div className="flex h-5 w-5 items-center justify-center">
                <div className="border-primary bg-primary/10 h-4 w-4 rounded border-2" />
              </div>
              <span className="text-primary flex-1 text-lg font-semibold">
                Informations Contractuelles
              </span>
              {expandedSections.contractual ? (
                <ChevronUp className="text-muted-foreground h-5 w-5" />
              ) : (
                <ChevronDown className="text-muted-foreground h-5 w-5" />
              )}
            </button>

            {expandedSections.contractual && (
              <div className="border-border space-y-6 border-t p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="dateEmbauche">
                      Date d&apos;embauche{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input id="dateEmbauche" type="date" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateFinContrat">
                      Date de fin de contrat
                    </Label>
                    <Input id="dateFinContrat" type="date" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="typeContrat">
                      Type de contrat{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Select required>
                      <SelectTrigger id="typeContrat">
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heuresTravail">
                    Heures de travail/semaine
                  </Label>
                  <Input
                    id="heuresTravail"
                    type="number"
                    defaultValue="40"
                    min="1"
                    max="168"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" size="lg">
              Annuler
            </Button>
            <Button
              type="submit"
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Créer le Personnel
            </Button>
          </div>
        </form>
      </div>
   
  );
}
