import { useState } from "react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

import { Button } from "@repo/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@repo/ui/components/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Skeleton } from "@repo/ui/components/skeleton";

import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { showErrorToast } from "~/lib/handle-error";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

interface StaffLevelSelectorProps {
  className?: string;
  disabled?: boolean;
  defaultValue?: string;
  onChange: (value: string | undefined) => void;
}

export const StaffLevelSelector = ({
  className,
  disabled = false,
  onChange,
  defaultValue,
}: StaffLevelSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>(defaultValue ?? "");
  const { t } = useLocale();
  const { openModal } = useModal();
  const trpc = useTRPC();

  const staffLevelsQuery = useQuery(trpc.degree.all.queryOptions());
  const staffLevels = staffLevelsQuery.data ?? [];

  if (staffLevelsQuery.isError) {
    showErrorToast(staffLevelsQuery.error);
  }
  if (staffLevelsQuery.isPending) {
    return <Skeleton className={cn("h-8 w-[250px]", className)} />;
  }

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen} modal={false}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            disabled={disabled}
            className={cn(`w-[250px] justify-between`, className)}
          >
            {value
              ? staffLevels.find((level) => level.id == value)?.name
              : t("select_an_option")}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="bottom" align="start">
          <Command>
            <CommandInput placeholder={t("search_for_an_option")} />
            <CommandList>
              <CommandEmpty>{t("no_data")}</CommandEmpty>
              <CommandGroup>
                <ScrollArea
                  className={staffLevels.length > 7 ? "h-[210px]" : ""}
                >
                  {staffLevels.map((level) => (
                    <CommandItem
                      key={level.id}
                      className="flex w-full cursor-pointer items-center justify-between space-x-2"
                      onSelect={(_selectedValue) => {
                        const v = level.id == value ? undefined : level.id;
                        onChange(v?.toString() ?? undefined);
                        setValue(v?.toString() ?? "");
                        setOpen(false);
                      }}
                    >
                      <span>{level.name}</span>
                      {value === level.id && (
                        <Check
                          className="text-brand"
                          strokeWidth={2}
                          size={16}
                        />
                      )}
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  className="flex w-full cursor-pointer items-center gap-x-2"
                  onSelect={() => {
                    openModal({
                      className: "w-96",
                      title: t("createANewLevel"),
                      view: <CreateStaffLevel />,
                    });
                  }}
                >
                  <Plus size={12} />
                  {t("createANewLevel")}
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const createLevelSchema = z.object({
  name: z.string().min(1),
});
function CreateStaffLevel() {
  const form = useForm({
    resolver: standardSchemaResolver(createLevelSchema),
    defaultValues: {
      name: "",
    },
  });
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { t } = useLocale();

  const createStaffLevelMutation = useMutation(
    trpc.degree.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.degree.all.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const handleSubmit = (data: z.infer<typeof createLevelSchema>) => {
    toast.loading(t("creating"), { id: 0 });
    createStaffLevelMutation.mutate(data);
  };

  const { closeModal } = useModal();
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("name")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="ml-auto flex flex-row items-center gap-2">
          <Button
            onClick={() => {
              closeModal();
            }}
            type="button"
            variant={"outline"}
            size={"sm"}
          >
            {t("cancel")}
          </Button>
          <Button
            isLoading={createStaffLevelMutation.isPending}
            type="submit"
            size={"sm"}
          >
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
