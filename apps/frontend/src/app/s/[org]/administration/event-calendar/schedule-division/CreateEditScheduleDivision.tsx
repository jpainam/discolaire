import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";

const DAYS_OF_WEEK = [
  { key: "lundi", label: "Lundi" },
  { key: "mardi", label: "Mardi" },
  { key: "mercredi", label: "Mercredi" },
  { key: "jeudi", label: "Jeudi" },
  { key: "vendredi", label: "Vendredi" },
  { key: "samedi", label: "Samedi" },
];

export function CreateEditScheduleDivision({
  slot,
}: {
  slot?: RouterOutputs["scheduleDivision"]["all"][number];
}) {
  {
    /* {isEditing === "new" ? "Ajouter un Créneau" : } */
  }

  const handleSave = () => {
    if (
      editingSlot.startTime &&
      editingSlot.endTime &&
      editingSlot.days &&
      editingSlot.days.length > 0
    ) {
      if (isEditing === "new") {
        const newSlot: TimeSlot = {
          id: Date.now().toString(),
          startTime: editingSlot.startTime,
          endTime: editingSlot.endTime,
          days: editingSlot.days,
        };
        setTimeSlots([...timeSlots, newSlot]);
      } else {
        setTimeSlots(
          timeSlots.map((slot) =>
            slot.id === isEditing
              ? ({ ...slot, ...editingSlot } as TimeSlot)
              : slot,
          ),
        );
      }
      setIsEditing(null);
      setEditingSlot({ startTime: "", endTime: "", days: [] });
    }
  };
  return (
    <div className="space-y-6">
      {/* Time Selection */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Début</label>
          <Input
            type="datetime-local"
            value={editingSlot.startTime || ""}
            onChange={(e) => handleTimeChange("startTime", e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Fin</label>
          <Input
            type="datetime-local"
            value={editingSlot.endTime || ""}
            onChange={(e) => handleTimeChange("endTime", e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Days Selection */}
      <div>
        <label className="mb-3 block text-sm font-medium">
          Jours de la semaine
        </label>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day.key} className="flex items-center space-x-2">
              <Checkbox
                id={day.key}
                checked={editingSlot.days?.includes(day.key) || false}
                onCheckedChange={(checked) =>
                  handleDayToggle(day.key, checked as boolean)
                }
              />
              <label htmlFor={day.key} className="text-sm font-medium">
                {day.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleCancel}>
          Annuler
        </Button>
        <Button onClick={handleSave}>
          {isEditing === "new" ? "Ajouter" : "Sauvegarder"}
        </Button>
      </div>
    </div>
  );
}
