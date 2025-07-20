import { MoreVertical, Truck } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  Card,
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

import { getServerTranslations } from "~/i18n/server";

export default async function Page() {
  // const templates = await getSMSTemplates();
  // const tags = await getSMSTemplateTags();
  const { t } = await getServerTranslations();
  return (
    <Card className="m-2">
      <CardHeader className="bg-muted/50 flex flex-row items-start border-b py-2">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            {t("sms_management.templates")}
          </CardTitle>
          <CardDescription>
            {t("sms_management.templates_description")}
          </CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <Truck className="h-4 w-4" />
            <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
              Track Order
            </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Trash</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid flex-row md:flex">
          {/* {templates && <SMSTemplateList templates={templates} />}
          {tags && <SMSTemplateTagList tags={tags} />} */}
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 border-t px-6 py-3">
        <div className="ml-auto flex flex-row items-center gap-4">
          <Button variant={"outline"} className="h-8">
            Cancel
          </Button>

          <Button className="h-8">Submit</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
