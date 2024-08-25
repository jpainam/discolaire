import { Checkbox } from "@repo/ui/checkbox";
import { Label } from "@repo/ui/label";
import { RadioGroup, RadioGroupItem } from "@repo/ui/radio-group";
import { Textarea } from "@repo/ui/textarea";

import { cn } from "~/lib/utils";
import { historyData, SubHistoryType } from "./data";

export default function HealthHistory({ history }: { history: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex md:grid md:grid-cols-12">
        <div className="font-bold md:col-span-8">
          Problèmes de santé passés et présents
        </div>
        <div className="flex font-bold md:col-span-4">
          Observation / Médicaments / Traitements
        </div>
      </div>
      {historyData.map((history, index) => {
        const bg =
          index % 2 === 0 ? "bg-secondary text-secondary-foreground" : "";
        return (
          <div
            key={history.id}
            className={cn(
              "grid grid-cols-1 rounded-md p-1 md:grid-cols-12",
              bg,
            )}
          >
            <div className="flex flex-row md:col-span-8">
              <RadioGroup
                className="flex w-auto flex-row items-start gap-2 pt-1"
                defaultValue="No"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    id="Yes"
                    value="Yes"
                    //checked={history.includes(history.id)}
                  />
                  <Label htmlFor="Yes">Oui</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="No" value="No" />
                  <Label htmlFor="No">No</Label>
                </div>
              </RadioGroup>
              <div className="flex w-full flex-col items-start px-2">
                <div>-- {history.title}</div>
                <div className="italic">
                  {history.description ?? history.description}
                </div>
                {history.sub_types && (
                  <DisplaySubHistory sub_types={history.sub_types} />
                )}
              </div>
            </div>
            <div className="p-1 md:col-span-4">
              <Textarea />
            </div>
          </div>
        );
      })}
      <div className="flex flex-col gap-4 md:grid md:grid-cols-12">
        <div className="flex md:col-span-6">
          <span>Notes internes: (Invisible sur les rapports)</span>
          <Textarea />
        </div>
        <div className="flex md:col-span-6">
          <span>Observations médicales: (Visible sur les rapports)</span>
          <Textarea />
        </div>
      </div>
    </div>
  );
}

function DisplaySubHistory({ sub_types }: { sub_types: SubHistoryType[] }) {
  return (
    <div className="flex w-full flex-wrap gap-2">
      {sub_types.map((subType: SubHistoryType) => (
        <div key={subType.id} className="flex flex-row space-x-2">
          {subType.type === "checkbox" && (
            <>
              <Checkbox id={subType.id} value={subType.id} />
              <Label htmlFor={subType.id}>{subType.title}</Label>
            </>
          )}
          {subType.type === "radio" && (
            <>
              <Label htmlFor={subType.id}>{subType.title}</Label>
              <RadioGroup
                className="flex w-[150px] flex-row items-start gap-4"
                defaultValue="No"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="Yes" value="Yes" />
                  <Label htmlFor="Yes">Oui</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="No" value="No" />
                  <Label htmlFor="No">No</Label>
                </div>
              </RadioGroup>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
