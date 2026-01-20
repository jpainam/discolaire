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
    <div className={cn("pb-4", className)}>
      <Accordion
        type="multiple"
        defaultValue={modules
          .filter((m) => m._count.permissions > 0)
          .map((m) => m.id)
          .slice(0, 3)}
      >
        {modules.map((module, index) => {
          const permissions = permissionRoles
            .filter((pr) => pr.permission.moduleId == module.id)
            .map((p) => p.permission);
          return (
            <AccordionItem value={module.id} key={index}>
              <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
                {module.name}
                <Badge className="rounded-full">
                  {module._count.permissions}
                </Badge>
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                {permissions.map((p, idx) => {
                  return (
                    <div className="flex flex-col gap-1" key={`${p.id}-${idx}`}>
                      <span>{p.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={"secondary"} className="text-primary">
                          {p.resource}
                        </Badge>
                        <Badge variant={"secondary"}>{p.type}</Badge>
                      </div>
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
