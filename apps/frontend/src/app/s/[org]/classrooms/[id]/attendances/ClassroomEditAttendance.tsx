import { useForm } from "@tanstack/react-form";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";

import { useModal } from "~/hooks/use-modal";

export function ClassroomEditAttendance({
  attendance,
}: {
  attendance: RouterOutputs["attendance"]["all"][number];
}) {
  const form = useForm();
  const { closeModal } = useModal();
  return (
    <form>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="termId">Term ID</Label>
            <Input id="termId" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="studentId">Student ID</Label>
            <Input id="studentId" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="studentName">Student Name</Label>
          <Input id="studentName" required />
        </div>

        <div className="border-t pt-4">
          <h4 className="mb-3 font-semibold">Attendance Data</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="absence">Absences</Label>
              <Input id="absence" type="number" min="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="justifiedAbsence">Justified Absences</Label>
              <Input id="justifiedAbsence" type="number" min="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="late">Late</Label>
              <Input id="late" type="number" min="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="justifiedLate">Justified Late</Label>
              <Input id="justifiedLate" type="number" min="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chatter">Chatter</Label>
              <Input id="chatter" type="number" min="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exclusion">Exclusions</Label>
              <Input id="exclusion" type="number" min="0" />
            </div>
          </div>
        </div>
      </div>
      <Button
        onClick={() => {
          closeModal();
        }}
        type="button"
        variant="outline"
      >
        Cancel
      </Button>
      <Button type="submit">Update Record</Button>
    </form>
  );
}
