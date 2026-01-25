"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { SendIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { getUserFromEntity } from "~/actions/user_action";
import { Button } from "~/components/ui/button";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Spinner } from "~/components/ui/spinner";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";

export function DropdownInvitation({
  entityId,
  entityType,
  email,
}: {
  entityType: "staff" | "student" | "contact";
  entityId: string;
  email?: string | null;
}) {
  const t = useTranslations();

  const { openModal } = useModal();

  return (
    <DropdownMenuItem
      disabled={!email}
      onSelect={async () => {
        const user = await getUserFromEntity({ entityId, entityType });
        openModal({
          className: "sm:max-w-xl",
          view: (
            <CreateNewUserForm
              userId={user.userId}
              username={user.username}
              entityId={entityId}
              entityType={entityType}
            />
          ),
        });
      }}
    >
      <SendIcon />
      {t("send_invite")}
    </DropdownMenuItem>
  );
}

function CreateNewUserForm({
  entityId,
  entityType,
  userId,
  username,
}: {
  entityId: string;
  username?: string;
  userId?: string | null;
  entityType: "staff" | "contact" | "student";
}) {
  const t = useTranslations();
  const [newUsername, setNewUsername] = useState<string | null>(
    username ?? null,
  );
  const [password, setPassword] = useState<string | null>();
  const [email, setEmail] = useState<string | null>();
  const { closeModal } = useModal();

  const trpc = useTRPC();
  const createUserMutation = useMutation(
    trpc.user.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: () => {
        toast.success(t("created_successfully"));
        closeModal();
      },
    }),
  );
  const updateUserMutation = useMutation(
    trpc.user.update.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: () => {
        toast.success(t("updated_successfully"));
        closeModal();
      },
    }),
  );
  const handleSubmit = () => {
    if (!newUsername) {
      toast.warning("Veuillez entrer tous les champs obligatoires");
      return;
    }
    if (userId) {
      updateUserMutation.mutate({
        id: userId,
        username: newUsername,
        email: email ?? undefined,
        password: password ?? undefined,
      });
    } else {
      createUserMutation.mutate({
        entityId,
        username: newUsername,
        email: email ?? undefined,
        password: password ?? undefined,
        profile: entityType,
      });
    }
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit();
      }}
      className="grid grid-cols-2 gap-6"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="username">{t("username")}</Label>
        <Input
          id="username"
          name="username"
          required
          placeholder={t("username")}
          onChange={(e) => setNewUsername(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          type="email"
          name="email"
          id="email"
          placeholder={t("username")}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="col-span-2 flex flex-col gap-2">
        <Label htmlFor="password">{t("password")}</Label>
        <Input
          required
          name="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="col-span-2 flex items-center gap-2">
        <Button
          onClick={() => {
            closeModal();
          }}
          type="button"
          variant={"secondary"}
        >
          {t("cancel")}
        </Button>
        <Button type="submit" disabled={createUserMutation.isPending}>
          {createUserMutation.isPending && <Spinner />}
          {userId ? t("update") : t("submit")}
        </Button>
      </div>
    </form>
  );
}
