"use client";

import { useTranslations } from "next-intl";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import { Textarea } from "@repo/ui/components/textarea";

const ReportCardSummary = () => {
  const t = useTranslations();

  return (
    <div className="m-5">
      <Tabs defaultValue="council">
        <TabsList>
          <TabsTrigger value="council">{t("classroom_council")}</TabsTrigger>
          <TabsTrigger value="observation">{t("observation")}</TabsTrigger>
        </TabsList>
        <TabsContent value="council">
          <div className="my-4 flex flex-col gap-4">
            <div className="flex flex-row gap-4">
              <Label className="w-[280px]">
                {t("comment_on_the_school_life")}
              </Label>
              <Textarea
                rows={2}
                cols={2}
                className="w-1/2"
                placeholder="Appreciation sur la vie scolaire"
              />
              <Button
                size={"sm"}
                onClick={() => {
                  console.log("save");
                }}
              >
                {t("submit")}
              </Button>
            </div>
            <div className="flex flex-row gap-4">
              <Label className="w-[280px]">
                {t("general_appreciation_of_the_classroom")}
              </Label>
              <Textarea
                rows={2}
                cols={2}
                className="w-1/2"
                placeholder="Appreciation general de la classe"
              />
              <div className="flex flex-col justify-between gap-2">
                <Button
                  size={"sm"}
                  onClick={() => {
                    console.log("save");
                  }}
                >
                  {t("submit")}
                </Button>
                <Button
                  variant={"outline"}
                  size={"sm"}
                  onClick={() => {
                    console.log("save");
                  }}
                >
                  {t("cancel")}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="observation">
          Change your password here.
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { ReportCardSummary };
