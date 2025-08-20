"use client";

import { useState } from "react";
import { Download, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { StudentCertificate } from "~/components/students/print/StudentCertificate";

export default function DataExportPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Categories for organizing the exports
  const categories = [
    { id: "student", name: "Student" },
    { id: "academic", name: "Academic" },
    { id: "administration", name: "Administration" },
    { id: "communication", name: "Communication" },
    { id: "settings", name: "Settings" },
  ];

  // All export options with their categories
  const exportOptions = [
    {
      id: 100,
      name: "Certificat de scolarité",
      content: StudentCertificate,

      category: "students",
    },
    {
      id: 101,
      name: "List of New Students",
      content: StudentCertificate,
      category: "students",
    },
  ];

  // Filter export options based on search query
  const filteredOptions = exportOptions.filter((option) =>
    option.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Function to get options by category
  const getOptionsByCategory = (category: string) => {
    return filteredOptions.filter((option) => option.category === category);
  };

  // Function to handle export
  const handleExport = (id: number, name: string) => {
    console.log(`Exporting ${name} (ID: ${id})`);
    // Implementation would connect to the actual export functionality
  };

  const [format, setFormat] = useQueryState("format", {
    defaultValue: "pdf",
  });
  const [termId, setTermId] = useQueryState("termId");
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-2 px-4 py-2">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
          <Input
            placeholder={t("search") + "..."}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <TermSelector
          defaultValue={termId}
          onChange={setTermId}
          className="w-full md:w-1/4"
        />

        <Select defaultValue={format} onValueChange={setFormat}>
          <SelectTrigger className="w-full md:w-[130px]">
            <SelectValue placeholder="Export format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pdf">
              <PDFIcon />
              PDF
            </SelectItem>
            <SelectItem value="csv">
              <XMLIcon />
              Excel
            </SelectItem>
          </SelectContent>
        </Select>

        {/* <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button> */}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="all">
            {t("all")}
            <Badge variant="secondary">{filteredOptions.length}</Badge>
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {t(category.name)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredOptions.map((option) => {
              const Content = option.content;
              return (
                <Content
                  id={option.id.toString()}
                  label={option.name}
                  key={option.id}
                />
              );
            })}
          </div>
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-0">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getOptionsByCategory(category.id).map((option) => (
                <div
                  key={option.id}
                  className="bg-muted flex items-center justify-between overflow-hidden rounded-md border p-2"
                >
                  <div>
                    <p className="text-muted-foreground text-sm">
                      #{option.id}
                    </p>
                    <p className="text-sm">{option.name}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => handleExport(option.id, option.name)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// export default function Page() {
//   return (
//     <div>
//       List des impression comme
//       <ul>
//         <li>
//           Situation des eleves debiteurs Situation financiere du 18 Mars 2025.
//           No, Matricule, Noms et Prenom, classes, total frais, total payé, Reste
//         </li>
//         ouvrir un dialog box Famille nombreuse, preciser le nombre d'enfant
//         (obligatoire), la classe (optional)
//         <li>Impression 2</li>
//         <li>Impression 3</li>
//       </ul>
//     </div>
//   );
// }
