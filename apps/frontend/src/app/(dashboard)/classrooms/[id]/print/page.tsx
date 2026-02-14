"use client";

import { Fragment, useState } from "react";
import { useParams } from "next/navigation";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";

import { PrintButtonClassroomStudentList } from "~/components/classrooms/print/PrintButtonClassroomStudentList";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { StudentPrintButton } from "~/components/students/print/StudentPrintButton";
import { Badge } from "~/components/ui/badge";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function DataExportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [format, setFormat] = useQueryState("format", {
    defaultValue: "pdf",
  });
  const [termId, setTermId] = useQueryState("termId");

  // Categories for organizing the exports
  const categories = [
    { id: "academic", name: "academy" },
    { id: "administration", name: "Administration" },
    { id: "communication", name: "Communication" },
    { id: "settings", name: "settings" },
  ];

  const params = useParams<{ id: string }>();
  // All export options with their categories
  const exportOptions = [
    {
      name: "Liste des élèves",
      content: (
        <PrintButtonClassroomStudentList
          classroomId={params.id}
          format={format}
        />
      ),
      category: "classroom",
    },
    {
      name: "Situation financière",
      content: (
        <StudentPrintButton
          label="Profil de l'élève"
          id="101"
          url={`/api/pdfs/student/${params.id}`}
        />
      ),
      category: "classroom",
    },
    {
      name: "Relevé de notes",
      content: (
        <StudentPrintButton
          label="Relevé de notes"
          id="102"
          url={`/api/pdfs/student/${params.id}/transcripts?format=${format}`}
        />
      ),
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

  const t = useTranslations();

  return (
    <div className="flex flex-col gap-2">
      <Separator />
      <div className="flex flex-col gap-4 px-4 md:flex-row">
        <InputGroup>
          <InputGroupInput
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("search")}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>

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

      <Tabs defaultValue="all" className="w-full px-4">
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
            {filteredOptions.map((option, index) => {
              return <Fragment key={index}>{option.content}</Fragment>;
            })}
          </div>
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-0">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getOptionsByCategory(category.id).map((option, index) => (
                <Fragment key={index}>{option.content}</Fragment>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
