"use client";

import { useState } from "react";
import {
  Download,
  FileCode,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  ImageIcon,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ViewIcon } from "~/icons";

// Helper function to get the appropriate icon based on file type
const getFileIcon = (fileType: string) => {
  switch (fileType.toLowerCase()) {
    case "pdf":
      return <FileText className="h-4 w-4 text-red-500" />;
    case "jpg":
    case "png":
    case "jpeg":
      return <ImageIcon className="h-4 w-4 text-blue-500" />;
    case "xlsx":
    case "xls":
      return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
    case "docx":
    case "doc":
      return <FileText className="h-4 w-4 text-blue-700" />;
    default:
      return <FileCode className="h-4 w-4 text-gray-500" />;
  }
};

// Sample data for documents
const documents = [
  {
    id: 1,
    name: "Class Schedule - Spring 2023",
    type: "xlsx",
    dateShared: "2023-01-15",
    sharedBy: "Ms. Johnson",
    category: "Schedule",
    thumbnail: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Field Trip Permission Form",
    type: "pdf",
    dateShared: "2023-02-10",
    sharedBy: "Mr. Williams",
    category: "Forms",
    thumbnail: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Science Project Guidelines",
    type: "docx",
    dateShared: "2023-02-15",
    sharedBy: "Ms. Johnson",
    category: "Assignments",
    thumbnail: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Class Photo - Winter Concert",
    type: "jpg",
    dateShared: "2023-12-20",
    sharedBy: "Mr. Williams",
    category: "Photos",
    thumbnail: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Math Homework - Week 10",
    type: "pdf",
    dateShared: "2023-03-05",
    sharedBy: "Ms. Thompson",
    category: "Assignments",
    thumbnail: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    name: "Parent-Teacher Conference Schedule",
    type: "xlsx",
    dateShared: "2023-03-10",
    sharedBy: "Principal Davis",
    category: "Schedule",
    thumbnail: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 7,
    name: "Art Project Examples",
    type: "png",
    dateShared: "2023-03-15",
    sharedBy: "Ms. Johnson",
    category: "Examples",
    thumbnail: "/placeholder.svg?height=40&width=40",
  },
];

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter documents based on search term and category
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      doc.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const t = useTranslations();

  return (
    <div className="mb-10 flex flex-col">
      <div className="flex flex-col items-start gap-2 border-b px-4 py-2 md:flex-row md:items-center">
        <FolderOpen className="hidden h-4 w-4 md:block" />
        <Label className="hidden md:block">{t("documents")}</Label>
        <div className="relative w-full md:ml-4 md:w-64">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            placeholder={t("search") + "..."}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="ml-auto flex w-full items-center gap-2 md:w-auto">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="schedule">Schedule</SelectItem>
              <SelectItem value="forms">Forms</SelectItem>
              <SelectItem value="assignments">Assignments</SelectItem>
              <SelectItem value="photos">Photos</SelectItem>
              <SelectItem value="examples">Examples</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Sort by Name</DropdownMenuItem>
              <DropdownMenuItem>Sort by Date</DropdownMenuItem>
              <DropdownMenuItem>Sort by Type</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-x-4 gap-y-2 px-4 py-2 md:grid-cols-2">
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map((doc) => (
            <Card key={doc.id} className="overflow-hidden p-0">
              <CardContent className="p-0">
                <div className="flex items-center p-2">
                  <div className="flex items-center space-x-2">
                    {getFileIcon(doc.type)}
                    <div>
                      <h3 className="text-sm font-medium">{doc.name}</h3>
                      <div className="text-muted-foreground flex items-center space-x-2 text-sm">
                        <span>
                          Shared on{" "}
                          {new Date(doc.dateShared).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>By {doc.sharedBy}</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-auto flex items-center space-x-2">
                    <Badge variant="outline" className="capitalize">
                      {doc.type.toUpperCase()}
                    </Badge>
                    <Button variant="ghost" size="icon">
                      <ViewIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-10 text-center">
            <p className="text-muted-foreground">
              No documents found matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
