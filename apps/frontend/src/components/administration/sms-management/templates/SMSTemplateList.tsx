import { Trash2 } from "lucide-react";

import { Button } from "@repo/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";
import { Textarea } from "@repo/ui/textarea";

import type { SMSTemplate } from "~/types/sms";

export function SMSTemplateList({ templates }: { templates: SMSTemplate[] }) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-2">
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Name</TableHead>
            <TableHead className="flex-1">Content</TableHead>
            <TableHead className="w-[45px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template, index) => {
            return (
              <TableRow key={`${template.id}-${index}`}>
                <TableCell>{template.name}</TableCell>
                <TableCell className="flex-1">
                  <Textarea>{template.content}</Textarea>
                </TableCell>
                <TableCell className="w-[45px]">
                  <div className="flex justify-end">
                    <Button
                      className="size-7"
                      size={"icon"}
                      variant={"outline"}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
