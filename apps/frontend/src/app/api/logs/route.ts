/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod/v4";

import type { ActivityType } from "@repo/db";

import { caller } from "~/trpc/server";

const schema = z.object({
  userId: z.string().min(1),
  schoolId: z.string(),
  activityType: z.string(),
  action: z.string(),
  entity: z.string(),
  entityId: z.string().optional(),
  data: z.any().optional(),
});
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      const error = z.treeifyError(result.error);
      return NextResponse.json(error, { status: 400 });
    }
    const { activityType, action, entity, entityId, data } = result.data;

    await caller.logActivity.create({
      activityType: activityType as ActivityType,
      action,
      entity,
      entityId,
      data,
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}

// create: protectedProcedure
//   .input(
//     z.object({
//       userId: z.string(),
//       action: z.string(),
//       entity: z.string(),
//       entityId: z.string(),
//       metadata: z.json(),
//     }),
//   )
//   .mutation(({ ctx, input }) => {
//     return ctx.db.logActivity.create({
//       data: {
//         userId: input.userId,
//         schoolId: ctx.schoolId,
//         action: input.action,
//         entity: input.entity,
//         entityId: input.entityId,
//         //metadata: input.metadata,
//       },
//     });
//   }),
