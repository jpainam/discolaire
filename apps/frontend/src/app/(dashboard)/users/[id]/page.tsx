import { notFound } from "next/navigation";

import { auth } from "@repo/auth";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import { LockKeyhole, Shield, User } from "lucide-react";
import { ReinitializePassword } from "~/components/users/password/ReinitializePassword";
import { PermissionTable } from "~/components/users/PermissionTable";
import { getServerTranslations } from "~/i18n/server";
import { api } from "~/trpc/server";
import { ChangeUserPassword } from "./ChangeUserPassword";
import { UserProfile } from "./UserProfile";
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  const { id } = params;
  const { t } = await getServerTranslations();

  const user = await api.user.get(id);
  if (!user) {
    notFound();
  }
  return (
    <div className="w-full px-4">
      <Tabs defaultValue="tab-1">
        <TabsList className="items-start justify-start text-foreground h-auto gap-2 rounded-none border-b bg-transparent px-0 py-1 w-full text-left">
          <TabsTrigger
            value="tab-1"
            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <User />
            {t("profile")}
          </TabsTrigger>
          <TabsTrigger
            value="tab-2"
            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <LockKeyhole />
            {t("password")}
          </TabsTrigger>
          <TabsTrigger
            value="tab-3"
            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <Shield />
            {t("permissions")}
          </TabsTrigger>
        </TabsList>
        <TabsContent className="px-4" value="tab-1">
          <UserProfile user={user} />
        </TabsContent>
        <TabsContent className="px-4" value="tab-2">
          {session?.user.id == user.id ? (
            <ReinitializePassword />
          ) : (
            <ChangeUserPassword user={user} />
          )}
        </TabsContent>
        <TabsContent className="px-4" value="tab-3">
          <PermissionTable userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
