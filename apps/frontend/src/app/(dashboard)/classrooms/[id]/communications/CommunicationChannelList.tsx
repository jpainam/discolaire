"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  BellIcon as BrandTelegram,
  CircleEqual,
  ExternalLink,
  Mail,
  MessageCircle,
  MessageSquare,
  MoreVertical,
  Pencil,
  Phone,
  Trash,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { useModal } from "~/hooks/use-modal";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { CreateEditCommunicationChannel } from "./CreateEditCommunicationChannel";

export function CommunicationChannelList() {
  const trpc = useTRPC();
  const { data: channels } = useSuspenseQuery(
    trpc.communicationChannel.all.queryOptions(),
  );

  const handleChannelClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const getChannelIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "whatsapp":
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case "sms":
        return <Phone className="h-5 w-5 text-blue-500" />;
      case "email":
        return <Mail className="h-5 w-5 text-purple-500" />;
      case "telegram":
        return <BrandTelegram className="h-5 w-5 text-blue-400" />;
      default:
        return <MessageCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  const queryClient = useQueryClient();
  const t = useTranslations();
  const deleteCommunicationChannel = useMutation(
    trpc.communicationChannel.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.communicationChannel.pathFilter(),
        );
        toast.success(t("success"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const { openModal } = useModal();
  const confirm = useConfirm();
  if (channels.length == 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CircleEqual />
          </EmptyMedia>
          <EmptyTitle>Aucun</EmptyTitle>
          <EmptyDescription>
            Vous n' aucun channal de communication pour cette classe
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent></EmptyContent>
      </Empty>
    );
  }
  return (
    <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-3">
      {channels.map((channel) => (
        <Card key={channel.id}>
          <CardHeader>
            <div
              onClick={() => handleChannelClick(channel.url)}
              className="flex cursor-pointer items-center gap-2"
            >
              {getChannelIcon(channel.type)}
              <CardTitle>{channel.name}</CardTitle>
            </div>
            <CardDescription
              onClick={() => handleChannelClick(channel.url)}
              className="flex cursor-pointer items-center gap-1 text-xs"
            >
              <ExternalLink className="h-3 w-3" />
              <span className="truncate">{channel.url}</span>
            </CardDescription>
            <CardAction>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"} size={"sm"}>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onSelect={() => {
                      openModal({
                        title: t("communications"),
                        description: t("edit"),
                        view: (
                          <CreateEditCommunicationChannel channel={channel} />
                        ),
                      });
                    }}
                  >
                    <Pencil />
                    {t("edit")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={async () => {
                      const isConfirmed = await confirm({
                        title: t("delete"),
                        description: t("delete_confirmation"),
                      });
                      if (isConfirmed) {
                        toast.loading(t("loading"), { id: 0 });
                        deleteCommunicationChannel.mutate(channel.id);
                      }
                    }}
                    variant="destructive"
                  >
                    <Trash />
                    {t("delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardAction>
          </CardHeader>
          <CardContent>
            {channel.lastAccessedAt && (
              <p className="truncate text-sm">
                {channel.lastAccessedAt.toISOString()}
              </p>
            )}
          </CardContent>
          {channel.lastAccessedById && (
            <CardFooter className="pt-0">
              <p className="text-muted-foreground text-xs">
                {channel.lastAccessedBy?.name}
              </p>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
}
