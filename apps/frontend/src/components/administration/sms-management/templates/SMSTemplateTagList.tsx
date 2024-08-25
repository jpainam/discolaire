import { ScrollArea } from "@repo/ui/scroll-area";
import { Separator } from "@repo/ui/separator";

export function SMSTemplateTagList({ tags }: { tags: string[] }) {
  return (
    <div className="rounded-md border p-2">
      <div className="font-bold">Supported tags</div>
      <Separator />
      <ScrollArea className="h-[calc(100vh-40rem)]">
        <ul className="gap-2">
          {tags.map((tag) => (
            <li
              className="cursor-pointer p-1 hover:text-green-600 hover:underline"
              key={tag}
            >
              {tag}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}
