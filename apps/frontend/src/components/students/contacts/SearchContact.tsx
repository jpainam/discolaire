import { ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useDebounce } from "@repo/hooks/use-debounce";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Skeleton } from "@repo/ui/components/skeleton";
import { useLocale } from "~/i18n";

import { RelationshipSelector } from "~/components/shared/selects/RelationshipSelector";
import { showErrorToast } from "~/lib/handle-error";
import rangeMap from "~/lib/range-map";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { getFullName } from "~/utils/full-name";

export function SearchContact({ onBack }: { onBack: () => void }) {
  const { t } = useLocale();
  const [value, setValue] = useState("");
  const params = useParams<{ id: string }>();
  const debounceValue = useDebounce(value, 500);
  const [relationship, setRelationship] = useState<string | null>(null);
  const createStudentContactMutation = api.studentContact.create.useMutation();

  const searchContactsQuery = api.contact.search.useQuery({ q: debounceValue });
  const utils = api.useUtils();

  return (
    <div className="flex flex-col gap-2 p-2">
      <RelationshipSelector
        showAllOption={false}
        className="h-8"
        onChange={(v) => {
          setRelationship(v);
        }}
      />

      <Input
        className="h-8"
        placeholder={t("search")}
        onChange={(event) => {
          setValue(event.target.value);
        }}
      />
      <span className="text-sm text-muted-foreground">{t("add")}</span>
      <div className={cn("flex-1")}>
        {searchContactsQuery.isPending ? (
          <div className="flex flex-col gap-1">
            {rangeMap(10, (i) => (
              <Skeleton className="h-8 w-full" key={i} />
            ))}
          </div>
        ) : (
          <ul>
            {searchContactsQuery.data?.map((contact) => {
              return (
                <li
                  key={contact.id}
                  onClick={() => {
                    if (!relationship) {
                      toast.error(t("please_select_relationship"));
                      return;
                    }
                    createStudentContactMutation.mutate(
                      {
                        studentId: params.id,
                        contactId: contact.id,
                        data: {
                          relationshipId: Number(relationship),
                        },
                      },
                      {
                        onSuccess: () => {
                          void utils.contact.students.invalidate();
                          void utils.student.contacts.invalidate();
                          toast.success(t("added_successfully"));
                        },
                        onError: (error) => {
                          showErrorToast(error);
                        },
                      }
                    );
                  }}
                  className="cursor-pointer overflow-hidden py-1 text-sm text-muted-foreground hover:text-blue-600 hover:text-primary hover:underline"
                >
                  {getFullName(contact)}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="ml-auto">
        <Button
          onClick={() => {
            onBack();
          }}
          variant={"outline"}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          {t("back")}
        </Button>
      </div>
    </div>
  );
}
