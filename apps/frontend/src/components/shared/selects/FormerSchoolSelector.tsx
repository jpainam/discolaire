import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@repo/ui/components/button";
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
import { Skeleton } from "@repo/ui/components/skeleton";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { zodResolver } from "@hookform/resolvers/zod";
import { decode } from "entities";
import { useForm } from "react-hook-form";
import { useRouter } from "~/hooks/use-router";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import VirtualizedCommand from "./VirtualizedCommand";

interface Option {
  value: string;
  label: string;
  avatar?: string;
}

interface FormerSchoolSelectorProps {
  searchPlaceholder?: string;
  placeholder?: string;
  width?: string;
  height?: string;
  className?: string;
  defaultValue?: string;
  onChange?: (value: string | null | undefined) => void;
}

export function FormerSchoolSelector({
  searchPlaceholder,
  placeholder,
  className,
  height = "400px",
  onChange,
  defaultValue,
}: FormerSchoolSelectorProps) {
  const formerSchoolsQuery = api.formerSchool.all.useQuery();

  const [open, setOpen] = useState<boolean>(false);
  const { openModal } = useModal();
  const [selectedOption, setSelectedOption] = useState<Option>({
    label: "",
    value: defaultValue ?? "",
  });
  const [options, setOptions] = React.useState<Option[]>([]);
  const { t } = useLocale();

  useEffect(() => {
    if (formerSchoolsQuery.data) {
      if (defaultValue) {
        const dValue = formerSchoolsQuery.data.find(
          (item) => item.id === defaultValue,
        );
        if (dValue) setSelectedOption({ label: dValue.name, value: dValue.id });
      }
      setOptions(
        formerSchoolsQuery.data.map((item) => ({
          label: decode(item.name),
          value: item.id,
          avatar: undefined,
        })),
      );
    }
  }, [defaultValue, formerSchoolsQuery.data]);

  if (formerSchoolsQuery.isPending) {
    return <Skeleton className={cn("h-10 w-full", className)} />;
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between truncate", className)}
        >
          {selectedOption.value
            ? options.find((option) => option.value === selectedOption.value)
                ?.label
            : (placeholder ?? t("select_an_option"))}{" "}
          {""}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 justify-end opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <VirtualizedCommand
          height={height}
          renderOption={({ option, isSelected }) => {
            return (
              <>
                <div className="flex flex-row items-center gap-2">
                  {option?.label}
                </div>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    isSelected ? "opacity-100" : "opacity-0",
                  )}
                />
              </>
            );
          }}
          options={options.map((option) => ({
            value: option.value,
            label: decode(option.label),
            avatar: option.avatar,
          }))}
          placeholder={searchPlaceholder ?? t("search")}
          selectedOption={selectedOption.value}
          onSelectOption={(currentValue) => {
            onChange?.(
              currentValue === selectedOption.value ? null : currentValue,
            );
            setSelectedOption({
              value: currentValue === selectedOption.value ? "" : currentValue,
              label: "",
            });
            setOpen(false);
          }}
          onAddButton={() => {
            openModal({
              title: `${t("create")} - ${t("school")}`,
              view: <CreateFormerSchool />,
            });
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

const createSchoolSchema = z.object({
  name: z.string().min(1),
});
function CreateFormerSchool() {
  const form = useForm({
    resolver: zodResolver(createSchoolSchema),
    defaultValues: {
      name: "",
    },
  });
  const utils = api.useUtils();
  const router = useRouter();
  const { closeModal } = useModal();
  const createFormerSchoolMutation = api.formerSchool.create.useMutation({
    onSettled: async () => {
      await utils.formerSchool.all.invalidate();
    },
    onSuccess: () => {
      toast.success(t("created_successfully"), { id: 0 });
      router.refresh();
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const onSubmit = (data: z.infer<typeof createSchoolSchema>) => {
    toast.loading(t("creating"), { id: 0 });
    createFormerSchoolMutation.mutate(data);
  };
  const { t } = useLocale();

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
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
        <div className="flex items-center justify-end gap-4">
          <Button
            onClick={() => {
              closeModal();
            }}
            variant={"outline"}
            size={"sm"}
          >
            {t("cancel")}
          </Button>
          <Button type="submit" size={"sm"}>
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
