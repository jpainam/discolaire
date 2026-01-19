import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";
import { getQueryClient, trpc } from "~/trpc/server";

export async function UserRolePermissionList({
  className,
  roleId,
}: {
  roleId: string;
  className?: string;
}) {
  const queryClient = getQueryClient();
  const permissionRoles = await queryClient.fetchQuery(
    trpc.userRole.permissions.queryOptions(roleId),
  );
  const modules = await queryClient.fetchQuery(trpc.module.all.queryOptions());

  return (
    <div className={cn(className)}>
      <Accordion type="multiple">
        {modules.map((module, index) => {
          const permissions = permissionRoles
            .filter((pr) => pr.permission.moduleId == module.id)
            .map((p) => p.permission);
          return (
            <AccordionItem value={module.id} key={index}>
              <AccordionTrigger>
                {module.name}
                <Badge className="rounded-full">
                  {module._count.permissions}
                </Badge>
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-2 gap-4">
                {permissions.map((p, idx) => {
                  return (
                    <div className="flex flex-col gap-1" key={`${p.id}-${idx}`}>
                      <span>{p.name}</span>
                      <Badge variant={"secondary"} className="text-cyan">
                        {p.resource}
                      </Badge>
                    </div>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
