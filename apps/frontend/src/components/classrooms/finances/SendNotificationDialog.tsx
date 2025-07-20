import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Textarea } from "@repo/ui/components/textarea";

import { DatePicker } from "~/components/shared/date-picker";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { getErrorMessage } from "~/lib/handle-error";
import { useTRPC } from "~/trpc/react";

export default function SendNotificationDialog() {
  const { closeModal } = useModal();
  const { t } = useLocale();
  const trpc = useTRPC();
  const sendEmailMutation = useMutation(
    trpc.messaging.sendEmail.mutationOptions(),
  );
  return (
    <>
      <div className="grid gap-1">
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" placeholder="Enter subject" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="body">Body</Label>
          <Textarea
            id="body"
            placeholder="Compose your email message..."
            className="min-h-[150px]"
            defaultValue="Hello,\n\nI hope this email finds you well. I wanted to follow up on the project we discussed earlier this week. Please let me know if you have any updates or if there's anything I can assist with.\n\nBest regards,\n[Your Name]"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="schedule">Schedule</Label>
            <Select>
              <SelectTrigger id="schedule">
                <SelectValue placeholder="Send immediately" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="now">Send immediately</SelectItem>
                <SelectItem value="end-of-day">End of day</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="custom">Custom date</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="custom-date">Date</Label>

            <DatePicker />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="template">Change template</Label>
          <Select>
            <SelectTrigger id="template">
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="template-1">Template 1</SelectItem>
              <SelectItem value="template-2">Template 2</SelectItem>
              <SelectItem value="template-3">Template 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="receipt" />
          <Label
            htmlFor="receipt"
            className="text-sm text-gray-600 dark:text-gray-400"
          >
            Request acknowledgment receipt?
          </Label>
        </div>
      </div>
      <div className="flex justify-between">
        <Button
          type="button"
          size={"sm"}
          variant="outline"
          onClick={() => {
            closeModal();
          }}
        >
          {t("cancel")}
        </Button>
        <Button
          type="button"
          size={"sm"}
          onClick={() => {
            toast.promise(
              sendEmailMutation.mutateAsync({
                subject: "Hello",
                body: "<p>Hello this is avery long content o tetes</p>",
                schedule: "now",
                to: ["jpainam@gmail.com"],
                receipt: false,
              }),
              {
                loading: t("sending"),
                error: (error) => {
                  return getErrorMessage(error);
                },
                success: () => {
                  closeModal();
                  return t("sent_successfully");
                },
              },
            );
          }}
        >
          {t("send")}
        </Button>
      </div>
    </>
  );
}
