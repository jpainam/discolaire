import { toast } from "sonner";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { Textarea } from "@repo/ui/textarea";

import { DatePicker } from "~/components/shared/date-picker";
import { useModal } from "~/hooks/use-modal";
import { getErrorMessage } from "~/lib/handle-error";
import { sendEmail } from "~/server/services/messaging-service";

export default function SendNotificationDialog() {
  const { openModal, closeModal } = useModal();
  const { t } = useLocale();
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
          variant="outline"
          onClick={() => {
            closeModal();
          }}
        >
          {t("cancel")}
        </Button>
        <Button
          type="button"
          onClick={() => {
            toast.promise(
              sendEmail({
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
