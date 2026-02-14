import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { z } from "zod/v4";

import { getDb } from "@repo/db";

import { env } from "~/env";

export const runtime = "nodejs";

const ATTENDANCE_STATUSES = [
  "present",
  "absent",
  "late",
  "holiday",
  "mission",
  "in_mission",
] as const;

const schema = z
  .object({
    staffId: z.string().min(1).optional(),
    userId: z.string().min(1).optional(),
    username: z.string().min(1).optional(),
    email: z.email().optional(),
    schoolId: z.string().min(1).optional(),
    status: z.enum(ATTENDANCE_STATUSES).optional(),
    timestamp: z.coerce.date().optional(),
    scheduledStartAt: z.coerce.date().optional(),
    lateAfterMinutes: z.coerce.number().int().min(0).max(720).optional(),
    source: z.string().trim().min(1).max(120).optional(),
    observation: z.string().trim().max(500).optional(),
    createdById: z.string().min(1).optional(),
    dedupeByDay: z.boolean().optional().default(true),
    allowInactive: z.boolean().optional().default(false),
    tenant: z.string().trim().min(1).max(40).optional(),
  })
  .refine(
    (data) => !!(data.staffId ?? data.userId ?? data.username ?? data.email),
    {
      message: "Provide one identifier: staffId, userId, username, or email.",
      path: ["staffId"],
    },
  );

type CheckinBody = z.infer<typeof schema>;

function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, init);
}

function extractApiKey(request: NextRequest) {
  const xApiKey = request.headers.get("x-api-key");
  if (xApiKey && xApiKey.trim().length > 0) {
    return xApiKey.trim();
  }

  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return null;
  }

  const [scheme, token] = authorization.split(/\s+/);
  if (scheme?.toLowerCase() === "bearer" && token) {
    return token.trim();
  }

  return null;
}

function secureEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function getDayBounds(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

function getComputedStatus(body: CheckinBody, eventAt: Date) {
  if (body.status) {
    return body.status;
  }
  if (!body.scheduledStartAt) {
    return "present";
  }
  const lateAfterMinutes = body.lateAfterMinutes ?? 0;
  const lateAfterTime = new Date(
    body.scheduledStartAt.getTime() + lateAfterMinutes * 60_000,
  );
  return eventAt > lateAfterTime ? "late" : "present";
}

function mergeObservation(existing: string | null | undefined, next?: string) {
  if (!next) {
    return existing ?? undefined;
  }
  if (!existing) {
    return next;
  }
  if (existing.includes(next)) {
    return existing;
  }
  return `${existing} | ${next}`;
}

function resolveTenant(request: NextRequest, bodyTenant?: string) {
  const queryTenant = new URL(request.url).searchParams.get("tenant");
  return (
    request.headers.get("discolaire-tenant") ??
    queryTenant ??
    bodyTenant ??
    env.NEXT_PUBLIC_DEFAULT_TENANT ??
    null
  );
}

async function resolveStaff(
  db: ReturnType<typeof getDb>,
  payload: CheckinBody,
) {
  const baseSelect = {
    id: true,
    firstName: true,
    lastName: true,
    isActive: true,
    schoolId: true,
    user: {
      select: {
        id: true,
        username: true,
        email: true,
      },
    },
  } as const;

  if (payload.staffId) {
    return db.staff.findUnique({
      where: { id: payload.staffId },
      select: baseSelect,
    });
  }

  if (payload.userId) {
    return db.staff.findFirst({
      where: { userId: payload.userId },
      select: baseSelect,
    });
  }

  if (payload.username) {
    return db.staff.findFirst({
      where: { user: { is: { username: payload.username } } },
      select: baseSelect,
    });
  }

  if (payload.email) {
    return db.staff.findFirst({
      where: {
        OR: [
          { email: payload.email },
          { user: { is: { email: payload.email } } },
        ],
      },
      select: baseSelect,
    });
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const providedApiKey = extractApiKey(request);
    if (
      !providedApiKey ||
      !secureEqual(providedApiKey, env.DISCOLAIRE_API_KEY)
    ) {
      return json(
        {
          error:
            "Unauthorized. Provide a valid API key in x-api-key or Authorization: Bearer <key>.",
        },
        { status: 401 },
      );
    }

    const rawBody: unknown = await request.json().catch(() => null);
    if (!rawBody || typeof rawBody !== "object") {
      return json({ error: "Invalid JSON body." }, { status: 400 });
    }
    const parsed = schema.safeParse(rawBody);
    if (!parsed.success) {
      return json({ error: z.treeifyError(parsed.error) }, { status: 400 });
    }

    const body = parsed.data;
    const tenant = resolveTenant(request, body.tenant);
    if (!tenant) {
      return json(
        {
          error:
            "Missing tenant. Send `discolaire-tenant` header, `?tenant=...`, or configure NEXT_PUBLIC_DEFAULT_TENANT.",
        },
        { status: 400 },
      );
    }

    let db: ReturnType<typeof getDb>;
    try {
      db = getDb({ connectionString: env.DATABASE_URL, tenant });
    } catch {
      return json(
        {
          error: "Invalid tenant value. Provide a valid `discolaire-tenant`.",
        },
        { status: 400 },
      );
    }
    const staff = await resolveStaff(db, body);
    if (!staff) {
      return json(
        { error: "Staff not found for the provided identifier." },
        { status: 404 },
      );
    }

    if (!body.allowInactive && !staff.isActive) {
      return json(
        {
          error:
            "Staff is inactive. Set `allowInactive: true` only if this is intentional.",
        },
        { status: 409 },
      );
    }

    if (body.schoolId && body.schoolId !== staff.schoolId) {
      return json(
        { error: "Staff does not belong to the provided schoolId." },
        { status: 403 },
      );
    }

    const eventAt = body.timestamp ?? new Date();
    const status = getComputedStatus(body, eventAt);
    const observation = [
      body.source ? `device:${body.source}` : null,
      body.observation,
    ]
      .filter(Boolean)
      .join(" | ");

    const { start, end } = getDayBounds(eventAt);
    const latestForDay = body.dedupeByDay
      ? await db.staffAttendance.findFirst({
          where: {
            staffId: staff.id,
            date: {
              gte: start,
              lt: end,
            },
          },
          orderBy: {
            date: "desc",
          },
        })
      : null;

    if (latestForDay) {
      const updated = await db.staffAttendance.update({
        where: { id: latestForDay.id },
        data: {
          status,
          startDate:
            eventAt < latestForDay.startDate ? eventAt : latestForDay.startDate,
          endDate:
            eventAt > latestForDay.endDate ? eventAt : latestForDay.endDate,
          date: eventAt < latestForDay.date ? eventAt : latestForDay.date,
          observation: mergeObservation(latestForDay.observation, observation),
        },
      });

      return json(
        {
          ok: true,
          action: "updated",
          tenant,
          attendance: updated,
          staff: {
            id: staff.id,
            firstName: staff.firstName,
            lastName: staff.lastName,
            username: staff.user?.username ?? null,
          },
        },
        { status: 200 },
      );
    }

    const attendance = await db.staffAttendance.create({
      data: {
        staffId: staff.id,
        date: eventAt,
        startDate: eventAt,
        endDate: eventAt,
        status,
        observation: observation || undefined,
        createdById: body.createdById,
      },
    });

    return json(
      {
        ok: true,
        action: "created",
        tenant,
        attendance,
        staff: {
          id: staff.id,
          firstName: staff.firstName,
          lastName: staff.lastName,
          username: staff.user?.username ?? null,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error while recording check-in.",
      },
      { status: 500 },
    );
  }
}
