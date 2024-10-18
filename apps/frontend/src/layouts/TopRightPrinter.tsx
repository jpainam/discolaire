"use client";

import {
  CheckCircleIcon,
  ClockIcon,
  Loader,
  LoaderIcon,
  PrinterIcon,
  RefreshCcw,
  Trash2Icon,
  XCircleIcon,
} from "lucide-react";
import { toast } from "sonner";

import { useLocale } from "@repo/hooks/use-locale";
import { useRouter } from "@repo/hooks/use-router";
import { Button } from "@repo/ui/button";
import { EmptyState } from "@repo/ui/EmptyState";
import FlatBadge from "@repo/ui/FlatBadge";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
import { ScrollArea } from "@repo/ui/scroll-area";

import { deleteFileFromAws, downloadFileFromAws } from "~/actions/upload";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { routes } from "~/configs/routes";
import { getErrorMessage } from "~/lib/handle-error";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export function TopRightPrinter() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case "FAILED":
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
      case "PENDING":
        return <LoaderIcon className="h-4 w-4 animate-spin text-blue-500" />;
      case "SCHEDULED":
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
    }
  };
  const getReportTypeIcon = (type: string) => {
    return type === "pdf" ? (
      <PDFIcon className="h-6 w-6" />
    ) : (
      <XMLIcon className="h-6 w-6" />
    );
  };
  const router = useRouter();
  const utils = api.useUtils();
  const deleteAllMutation = api.reporting.clearAll.useMutation({
    onSettled: () => {
      void utils.reporting.invalidate();
    },
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const reportingQuery = api.reporting.userReports.useQuery();

  const deleteReportingMutation = api.reporting.delete.useMutation();

  const { t, i18n } = useLocale();
  //const confirm = useConfirm();
  const dateFormat = Intl.DateTimeFormat(i18n.language, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

  console.log("reportingQuery", reportingQuery.data);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <PrinterIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        {/* <h4 className="mb-2 font-medium">{t("reports")}</h4> */}
        {reportingQuery.isPending && (
          <div className="flex items-center justify-center">
            <Loader className="h-6 w-6 animate-spin" />
          </div>
        )}
        {reportingQuery.data?.length === 0 && (
          <EmptyState title={t("no_reports")} />
        )}
        <div className="ml-auto flex justify-end">
          <Button
            onClick={async () => {
              toast.loading(t("refreshing"), { id: 0 });
              await reportingQuery.refetch();
              toast.success(t("refreshed"), { id: 0 });
            }}
            variant={"ghost"}
            size={"sm"}
          >
            <RefreshCcw
              className={cn(
                "mr-2 h-4 w-4",
                reportingQuery.isFetching && "animate-spin",
              )}
            />
            {t("refresh")}
          </Button>
        </div>
        <ScrollArea className="max-h-[calc(100vh-20rem)] w-full px-2">
          {reportingQuery.data?.map((activity) => (
            <div
              key={activity.id}
              className="my-2 flex items-center justify-between rounded-lg border p-2 hover:bg-muted hover:text-muted-foreground"
            >
              <div
                onClick={() => {
                  toast.promise(downloadFileFromAws(activity.url), {
                    success: (signedUrl) => {
                      window.open(signedUrl, "_blank");
                      return t("downloaded");
                    },
                    loading: t("downloading"),
                    error: (error) => {
                      return getErrorMessage(error);
                    },
                  });
                }}
                className="flex w-full cursor-pointer items-center space-x-2"
              >
                {getReportTypeIcon(activity.type)}
                <div className="flex w-full flex-col gap-1">
                  <span className="line-clamp-1 truncate text-xs">
                    {activity.title}
                  </span>
                  <div className="flex flex-row text-xs text-muted-foreground">
                    {dateFormat.format(activity.createdAt)}
                    <span className="pl-10">
                      {activity.size >= 0
                        ? `${(activity.size / 1000).toFixed(1)}KB`
                        : ""}
                    </span>
                    <div className="ml-auto">
                      <FlatBadge
                        variant={
                          activity.status == "COMPLETED"
                            ? "green"
                            : activity.status == "PENDING"
                              ? "yellow"
                              : "red"
                        }
                        className="flex w-[100px] items-center space-x-1 border-none bg-transparent py-0 text-xs"
                      >
                        {getStatusIcon(activity.status)}
                        <span className="text-xs lowercase">
                          {t(activity.status.toLowerCase())}
                        </span>
                      </FlatBadge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={deleteReportingMutation.isPending}
                  onClick={() => {
                    // const isConfirmed = await confirm({
                    //   title: t("delete"),
                    //   description: t("delete_confirmation"),
                    //   icon: <Trash2Icon className="h-4 w-4 text-destructive" />,
                    //   alertDialogTitle: {
                    //     className: "flex items-center gap-2",
                    //   },
                    // });
                    //if (isConfirmed) {
                    toast.loading(t("deleting"), { id: 0 });
                    void deleteReportingMutation.mutate(activity.id, {
                      onSettled: () => {
                        void utils.reporting.invalidate();
                      },
                      onSuccess: () => {
                        toast.success(t("deleted_successfully"), { id: 0 });
                        try {
                          if (activity.url) {
                            void deleteFileFromAws(activity.url);
                          }
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        } catch (error: any) {
                          console.error(error);
                          //toast.error(error?.message, { id: 0 });
                        }
                      },
                      onError: (error) => {
                        toast.error(error.message, { id: 0 });
                      },
                    });
                    //}
                  }}
                >
                  <Trash2Icon className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </ScrollArea>
        {(reportingQuery.data ?? []).length > 0 && (
          <div className="grid grid-cols-2 gap-2 border-t p-2">
            <Button
              onClick={() => {
                router.push(routes.reports.index);
              }}
              variant={"ghost"}
            >
              {t("view_all")}
            </Button>
            <Button
              disabled={deleteAllMutation.isPending}
              onClick={() => {
                toast.loading(t("deleting"), { id: 0 });
                deleteAllMutation.mutate();
              }}
              variant={"ghost"}
            >
              <span className="text-destructive">{t("clear_all")}</span>
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
