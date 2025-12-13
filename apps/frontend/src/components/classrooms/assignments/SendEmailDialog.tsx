import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

export function SendEmailDialog() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Checkbox /> <Label>Send email to Parents</Label>
      </div>
      <div>
        <Checkbox checked={true} /> <Label>Send email to Students</Label>
      </div>
      <div>
        <Label>Subject</Label>
        <Input placeholder="Assignment title" />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea>
          <p>
            Due Date: 12th October 2021 <br />
            Section: Course #: Maths Course Name: Algebra <br />
            Teacher: Mr. John Doe <br />
            Dear Parents, <br />
            Include a link to video or document if needed. <br />
            <br />
            This is to inform you that your child has been assigned an
            assignment. Please make sure that your child completes the
            assignment on time.
            <br />
            <br />
            Regards, <br />
            <br />
            School Administration
          </p>
        </Textarea>
      </div>
      <div>
        <Button>Send</Button>
        <Button>Cancel</Button>
      </div>
    </div>
  );
}
