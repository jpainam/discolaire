"use client";

import Link from "next/link";
import { Edit, Eye, HelpCircle, Plus, Square, Trash2 } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export default function PaiementsPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto max-w-[1600px] p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Square className="text-primary h-5 w-5" />
              <h1 className="text-primary text-2xl font-semibold">
                Paiements des Salaires
              </h1>
            </div>
            <nav className="text-muted-foreground flex items-center gap-2 text-sm">
              <span>Accueil</span>
              <span>/</span>
              <span>Finances</span>
              <span>/</span>
              <span className="text-foreground">Paiements Salaires</span>
            </nav>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 bg-transparent">
              <HelpCircle className="h-4 w-4" />
              Aide
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              asChild
            >
              <Link href="/nouveau">
                <Plus className="h-4 w-4" />
                Nouveau Paiement
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 rounded-lg p-3">
                  <Square className="text-primary h-6 w-6" />
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 text-sm">
                    Total Paiements
                  </p>
                  <p className="text-3xl font-semibold">1</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-orange-100 p-3">
                  <Square className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 text-sm">
                    En Attente
                  </p>
                  <p className="text-3xl font-semibold text-orange-500">1</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-green-100 p-3">
                  <Square className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 text-sm">Payés</p>
                  <p className="text-3xl font-semibold text-green-500">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-blue-100 p-3">
                  <Square className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 text-sm">
                    Total ce mois
                  </p>
                  <p className="text-3xl font-semibold text-blue-500">0</p>
                  <p className="text-muted-foreground mt-1 text-xs">FCFA</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-muted-foreground mb-6 text-sm font-semibold tracking-wide uppercase">
              Liste des paiements de salaires
            </h2>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-3">
              <Input
                placeholder="N° de paiement..."
                className="bg-background w-64"
              />
              <Select defaultValue="all-types">
                <SelectTrigger className="bg-background w-48">
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-types">Tous les types</SelectItem>
                  <SelectItem value="personnel">Personnel</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all-status">
                <SelectTrigger className="bg-background w-48">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="paid">Payé</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                placeholder="Sélectionner une date"
                className="bg-background w-48"
              />
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Square className="mr-2 h-4 w-4" />
                Filtrer
              </Button>
              <Button variant="outline">
                <Square className="h-4 w-4" />
              </Button>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/5 hover:bg-primary/5">
                    <TableHead className="text-foreground font-semibold">
                      N° Paiement
                    </TableHead>
                    <TableHead className="text-foreground font-semibold">
                      Bénéficiaire
                    </TableHead>
                    <TableHead className="text-foreground font-semibold">
                      Type
                    </TableHead>
                    <TableHead className="text-foreground font-semibold">
                      Période
                    </TableHead>
                    <TableHead className="text-foreground font-semibold">
                      Salaire Brut
                    </TableHead>
                    <TableHead className="text-foreground font-semibold">
                      Déductions
                    </TableHead>
                    <TableHead className="text-foreground font-semibold">
                      Salaire Net
                    </TableHead>
                    <TableHead className="text-foreground font-semibold">
                      Statut
                    </TableHead>
                    <TableHead className="text-foreground font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() =>
                      (window.location.href = "/paiements/PAY-2025-10-0001")
                    }
                  >
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        PAY-2025-10-0001
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold">DOMCHE FRIDE</p>
                        <p className="text-muted-foreground text-sm">DIR0002</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-blue-500 text-white hover:bg-blue-600"
                      >
                        Personnel
                      </Badge>
                    </TableCell>
                    <TableCell>octobre 2025</TableCell>
                    <TableCell className="font-medium">145 000</TableCell>
                    <TableCell className="font-medium text-red-500">
                      7 250
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
                      137 750
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-orange-500 text-white hover:bg-orange-600">
                        En attente
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div
                        className="flex gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                        >
                          <Square className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                        >
                          <Eye className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                        >
                          <Edit className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
