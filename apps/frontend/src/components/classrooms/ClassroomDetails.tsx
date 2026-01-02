"use client";

import type { ReactNode } from "react";
import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { sumBy } from "lodash";
import {
  BookUser,
  CircleDollarSign,
  CircleGauge,
  CircleUser,
  Hash,
  Newspaper,
  Recycle,
  SquareLibrary,
  SquareUser,
  TableProperties,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { useTRPC } from "~/trpc/react";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "../ui/item";

export function ClassroomDetails() {
  const locale = useLocale();
  const trpc = useTRPC();
  const params = useParams<{ id: string }>();
  const { data: fees } = useSuspenseQuery(
    trpc.classroom.fees.queryOptions(params.id),
  );
  const { data: classroom } = useSuspenseQuery(
    trpc.classroom.get.queryOptions(params.id),
  );
  return (
    <div className="grid grid-cols-1 gap-4 divide-x border-t p-2 md:grid-cols-4 lg:grid-cols-5">
      <ItemLabel
        label={"name"}
        value={classroom.name}
        icon={<TableProperties />}
      />
      <ItemLabel
        label={"reportName"}
        value={classroom.reportName}
        icon={<Newspaper />}
      />
      <ItemLabel
        label={"section"}
        value={classroom.section?.name}
        icon={<SquareLibrary />}
      />
      <ItemLabel
        label={"fees"}
        value={sumBy(fees, "amount").toLocaleString(locale)}
        icon={<CircleDollarSign />}
      />
      <ItemLabel
        label={"level"}
        value={classroom.level.name}
        icon={<CircleGauge />}
      />
      <ItemLabel
        label={"cycle"}
        value={classroom.cycle?.name}
        icon={<Recycle />}
      />
      <ItemLabel
        label={"senior_advisor"}
        value={classroom.seniorAdvisor?.lastName}
        icon={<SquareUser />}
      />
      <ItemLabel
        label={"classroom_leader"}
        value={classroom.classroomLeader?.lastName}
        icon={<BookUser />}
      />
      <ItemLabel
        label={"max_size"}
        value={classroom.maxSize.toString()}
        icon={<Hash />}
      />
      <ItemLabel
        label={"head_teacher"}
        value={classroom.headTeacher?.lastName}
        icon={<CircleUser />}
      />
    </div>
  );
}

function ItemLabel({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | null;
  icon: ReactNode;
}) {
  const t = useTranslations();
  return (
    <Item className="p-0">
      <ItemMedia variant="icon">{icon}</ItemMedia>
      <ItemContent>
        <ItemTitle> {t(label)}</ItemTitle>
        <ItemDescription> {value ?? "#"}</ItemDescription>
      </ItemContent>
    </Item>
  );
}
