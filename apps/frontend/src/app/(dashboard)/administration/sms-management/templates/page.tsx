import { MoreVertical, Truck } from "lucide-react";

import { getServerTranslations } from "@repo/i18n/server";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";

export default async function Page() {
  // const templates = await getSMSTemplates();
  // const tags = await getSMSTemplateTags();
  const { t } = await getServerTranslations("admin");
  return (
    <Card className="m-2">
      <CardHeader className="flex flex-row items-start border-b bg-muted/50 py-2">
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
      <CardFooter className="border-t bg-muted/50 px-6 py-3">
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
