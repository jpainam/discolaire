"use client";

import { Search } from "lucide-react";
import { useState } from "react";

import type { RouterOutputs } from "@repo/api";
import { StudentStatus } from "@repo/db";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { searchStudents } from "~/actions/search";
import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { useLocale } from "~/i18n";
import { StudentSearchResultCard } from "./StudentSearchResultCard";

export function StudentSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchResults, setSearchResults] = useState<
    RouterOutputs["student"]["search"]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const { t } = useLocale();

  const handleSearch = async () => {
    setIsSearching(true);
    let results = await searchStudents({
      q: searchQuery,
      classroomId: selectedClassroom,
    });
    if (selectedStatus !== "all") {
      const status = selectedStatus as StudentStatus;
      results = results.filter((student) => student.status == status);
    }
    setSearchResults(results);
    setIsSearching(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b px-4 py-2">
        <div className="gap-2 flex flex-col">
          <div className="flex items-center flex-row gap-4 max-w-4xl">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t(
                  "Enter a student name, ID, or email to get started."
                )}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                //onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button
              disabled={isSearching}
              isLoading={isSearching}
              onClick={handleSearch}
              size={"sm"}
            >
              {t("search")}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-4xl">
            <ClassroomSelector
              className="w-full"
              onChange={(val) => {
                setSelectedClassroom(val ?? "");
              }}
            />

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("Status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("All Status")}</SelectItem>
                <SelectItem value={`${StudentStatus.ACTIVE}`}>
                  {t("active")}
                </SelectItem>
                <SelectItem value={`${StudentStatus.INACTIVE}`}>
                  {t("inactive")}
                </SelectItem>
                <SelectItem value={`${StudentStatus.EXPELLED}`}>
                  {t("expelled")}
                </SelectItem>
                <SelectItem value={`${StudentStatus.GRADUATED}`}>
                  {t("graduated")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-3 px-4 py-2 ">
        {searchResults.map((student) => (
          <StudentSearchResultCard key={student.id} student={student} />
        ))}
      </div>

      {/* {searchResults.length === 0 &&
        (searchQuery || selectedClassroom || selectedStatus != "all") && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 " />
            <h3 className="mt-4">{t("No students found")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("Try adjusting your search criteria or check the spelling.")}
            </p>
          </div>
        )} */}

      {searchResults.length == 0 && (
        <div className="text-center text-sm py-12">
          <Search className="mx-auto h-12 w-12 " />
          <h3 className="mt-4">{t("Search for students")}</h3>
          <p className="mt-2 text-xs text-muted-foreground">
            {t("Enter a student name, ID, or email to get started.")}
          </p>
        </div>
      )}
    </div>
  );
}
