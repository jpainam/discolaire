"use client";

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
import { Download, Search } from "lucide-react";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { useLocale } from "~/i18n";

export default function DataExportPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Categories for organizing the exports
  const categories = [
    { id: "students", name: "Students" },
    { id: "academic", name: "Academic" },
    { id: "administration", name: "Administration" },
    { id: "communication", name: "Communication" },
    { id: "settings", name: "Settings" },
  ];

  // All export options with their categories
  const exportOptions = [
    { id: 100, name: "List of Students", category: "students" },
    { id: 101, name: "List of New Students", category: "students" },
    { id: 102, name: "List of Subjects", category: "academic" },
    { id: 103, name: "Financial Situation", category: "administration" },
    { id: 104, name: "List of Teachers", category: "administration" },
    { id: 105, name: "List of Courses", category: "academic" },
    { id: 106, name: "Schedules", category: "academic" },
    { id: 107, name: "List of Exams", category: "academic" },
    { id: 108, name: "List of Grades", category: "academic" },
    { id: 109, name: "List of Absences", category: "students" },
    { id: 110, name: "List of Late Arrivals", category: "students" },
    { id: 111, name: "List of Sanctions", category: "students" },
    { id: 112, name: "List of Rewards", category: "students" },
    { id: 113, name: "List of Events", category: "administration" },
    { id: 114, name: "List of Tasks", category: "administration" },
    { id: 115, name: "List of Documents", category: "administration" },
    { id: 116, name: "List of Parameters", category: "settings" },
    { id: 117, name: "List of Users", category: "administration" },
    { id: 118, name: "List of Roles", category: "administration" },
    { id: 119, name: "List of Permissions", category: "administration" },
    { id: 120, name: "List of Groups", category: "students" },
    { id: 121, name: "List of Notifications", category: "communication" },
    { id: 122, name: "List of Messages", category: "communication" },
    { id: 123, name: "List of Conversations", category: "communication" },
    { id: 124, name: "Messaging Settings", category: "settings" },
    { id: 125, name: "Notification Settings", category: "settings" },
    { id: 126, name: "Security Settings", category: "settings" },
    { id: 127, name: "Application Settings", category: "settings" },
    { id: 128, name: "School Settings", category: "settings" },
    { id: 129, name: "School Year Settings", category: "settings" },
    { id: 130, name: "Class Settings", category: "settings" },
    { id: 131, name: "Classroom Settings", category: "settings" },
    { id: 132, name: "Course Settings", category: "settings" },
    { id: 133, name: "Exam Settings", category: "settings" },
    { id: 134, name: "Grade Settings", category: "settings" },
    { id: 135, name: "Absence Settings", category: "settings" },
    { id: 136, name: "General Parameters", category: "settings" },
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
    defaultValue: "csv",
  });
  const { t } = useLocale();

  return (
    <div className="container mx-auto py-3 px-4">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("search") + "..."}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <TermSelector className="w-full md:w-[250px]" />

        <Select defaultValue={format} onValueChange={setFormat}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Export format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="csv">Excel</SelectItem>
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
            All <Badge variant="secondary">{filteredOptions.length}</Badge>
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOptions.map((option) => (
              <div
                key={option.id}
                className="p-2 border rounded-md bg-muted flex overflow-hidden justify-between items-center"
              >
                <div>
                  <p className="text-sm text-muted-foreground">#{option.id}</p>
                  <p className="text-sm">{option.name}</p>
                </div>
                <Button
                  variant="ghost"
                  className="size-8"
                  size="icon"
                  onClick={() => handleExport(option.id, option.name)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getOptionsByCategory(category.id).map((option) => (
                <div
                  key={option.id}
                  className="border rounded-md p-2 bg-muted flex justify-between items-center overflow-hidden"
                >
                  <div>
                    <p className="text-sm text-muted-foreground">
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
