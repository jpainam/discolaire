import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod/v4";

import { ChatSDKError } from "~/lib/errors";
import {
  getAiAuthContext,
  listChats,
  softDeleteAllChats,
} from "~/server/ai/repository";

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).optional(),
  ending_before: z.string().min(1).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const parseResult = querySchema.safeParse({
      limit: request.nextUrl.searchParams.get("limit") ?? undefined,
      ending_before:
        request.nextUrl.searchParams.get("ending_before") ?? undefined,
    });

    if (!parseResult.success) {
      return new ChatSDKError(
        "bad_request:api",
        "Invalid query params.",
      ).toResponse();
    }

    const { db, userId } = await getAiAuthContext();
    const result = await listChats(db, {
      userId,
      limit: parseResult.data.limit ?? 20,
      endingBefore: parseResult.data.ending_before,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }

    console.error(error);
    return new ChatSDKError("bad_request:api").toResponse();
  }
}

export async function DELETE() {
  try {
    const { db, userId } = await getAiAuthContext();
    await softDeleteAllChats(db, userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }

    console.error(error);
    return new ChatSDKError("bad_request:api").toResponse();
  }
}
