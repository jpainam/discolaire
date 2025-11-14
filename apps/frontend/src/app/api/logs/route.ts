/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createErrorMap, fromError } from "zod-validation-error/v4";
import { z } from "zod/v4";

z.config({
  customError: createErrorMap({
    includePath: true,
  }),
});

const schema = z.object({
  userId: z.string().min(1),
  schoolId: z.string(),
  action: z.string(),
  entity: z.string(),
  entityId: z.string(),
  metadata: z.json(),
});
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      const validationError = fromError(result.error);
      return NextResponse.json(
        { error: validationError.message },
        { status: 400 },
      );
    }
    const { userId, schoolId, action, entity, entityId, metadata } =
      result.data;

    // await caller.logActivity.create({
    //   userId,
    //   schoolId,
    //   action,
    //   entity,
    //   entityId,
    //   metadata,
    // });

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
