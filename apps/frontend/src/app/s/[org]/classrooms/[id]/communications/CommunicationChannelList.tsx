"use client";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { t } from "i18next";
import {
  BellIcon as BrandTelegram,
  ExternalLink,
  Mail,
  MessageCircle,
  MessageSquare,
  MoreVertical,
  Pencil,
  Phone,
  Trash,
} from "lucide-react";
import { toast } from "sonner";
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
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 px-4">
      {channels.map((channel) => (
        <Card key={channel.id}>
          <CardHeader>
            <div
              onClick={() => handleChannelClick(channel.url)}
              className="cursor-pointer flex items-center gap-2"
            >
              {getChannelIcon(channel.type)}
              <CardTitle>{channel.name}</CardTitle>
            </div>
            <CardDescription
              onClick={() => handleChannelClick(channel.url)}
              className="cursor-pointer flex items-center gap-1 text-xs"
            >
              <ExternalLink className="h-3 w-3" />
              <span className="truncate">{channel.url}</span>
            </CardDescription>
            <CardAction>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"} size={"sm"}>
                    <MoreVertical className="w-4 h-4" />
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
              <p className="text-sm truncate">
                {channel.lastAccessedAt.toISOString()}
              </p>
            )}
          </CardContent>
          {channel.lastAccessedById && (
            <CardFooter className="pt-0">
              <p className="text-xs text-muted-foreground">
                {channel.lastAccessedBy?.name}
              </p>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
}
