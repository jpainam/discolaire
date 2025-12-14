"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";

import type { RouterOutputs } from "@repo/api";
import { StudentStatus } from "@repo/db/enums";

import { searchStudents } from "~/actions/search";
import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { Button } from "~/components/ui/button";
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
import { StudentSearchResultCard } from "./StudentSearchResultCard";

export function StudentSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClassroom, setSelectedClassroom] =
    useQueryState("classroomId");

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchResults, setSearchResults] = useState<
    RouterOutputs["student"]["all"]
  >([]);
  const [isSearching, setIsSearching] = useState(false);

  const t = useTranslations();

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
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b px-4 py-2">
        <div className="flex flex-col gap-2">
          <div className="flex max-w-4xl flex-row items-center gap-4">
            <InputGroup className="flex-1">
              <InputGroupInput
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("search")}
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>

            <Button
              disabled={isSearching}
              isLoading={isSearching}
              onClick={handleSearch}
            >
              {t("search")}
            </Button>
          </div>

          <div className="grid max-w-4xl grid-cols-1 gap-4 lg:grid-cols-3">
            <ClassroomSelector
              className="w-full"
              defaultValue={selectedClassroom ?? undefined}
              onSelect={(val) => {
                void setSelectedClassroom(val);
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

      <div className="grid gap-3 px-4 py-2">
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
        <div className="py-12 text-center text-sm">
          <Search className="mx-auto h-12 w-12" />
          <h3 className="mt-4">{t("search")}</h3>
          <p className="text-muted-foreground mt-2 text-xs">{t("search")}</p>
        </div>
      )}
    </div>
  );
}
