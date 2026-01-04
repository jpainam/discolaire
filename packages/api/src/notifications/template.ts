import { TRPCError } from "@trpc/server";

import type { NotificationSourceType, PrismaClient } from "@repo/db";

/** Flat keys only: {{studentName}} */
const VAR_REGEX = /{{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*}}/g;

function extractVars(text: string): string[] {
  if (!text) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = VAR_REGEX.exec(text)) !== null) {
    const key = m[1];
    if (!key) continue;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(key);
    }
  }
  return out;
}

function isMissingValue(v: unknown) {
  if (v === null || v === undefined) return true;
  if (typeof v === "string" && v.trim() === "") return true;
  return false;
}

function stringifyValue(v: unknown) {
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "object") return JSON.stringify(v);
  return v as string;
}

export interface RenderedTemplate {
  template: {
    id: string;
    schoolId: string;
    sourceType: string;
    channel: string;
    locale: string | null;
    name: string;
  };
  subject: string | null;
  body: string;
  diagnostics: {
    referencedVars: string[];
    missingVars: string[];
    unknownVars: string[];
  };
}

async function getAllowedVarSet(params: {
  db: PrismaClient;
  schoolId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sourceType: any; // Prisma enum type, keep as any for portability here
}) {
  const vars = await params.db.notificationTemplateVariable.findMany({
    where: {
      sourceType: params.sourceType as NotificationSourceType,
      schoolId: params.schoolId,
    },
    select: { key: true },
  });
  return new Set(vars.map((v) => v.key));
}

/**
 * Load template from DB and render with payload.
 * - Validates referenced variables exist in catalog (system + school variables)
 * - Highlights missing payload values (optional: you can throw instead)
 */
export async function renderTemplateFromDb(params: {
  db: PrismaClient;
  templateId: string;
  payload: Record<string, unknown>;
  // Optional behavior:
  throwOnMissingPayload?: boolean; // default false
}): Promise<RenderedTemplate> {
  const tpl = await params.db.notificationTemplate.findUnique({
    where: { id: params.templateId },
  });

  if (!tpl) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Template not found." });
  }

  const subjectTemplate = tpl.subjectTemplate ?? "";
  const bodyTemplate = tpl.bodyTemplate;

  const referencedVars = Array.from(
    new Set([...extractVars(subjectTemplate), ...extractVars(bodyTemplate)]),
  );

  const allowedVars = await getAllowedVarSet({
    db: params.db,
    schoolId: tpl.schoolId,
    sourceType: tpl.sourceType,
  });

  const unknownVars = referencedVars.filter((v) => !allowedVars.has(v));
  if (unknownVars.length > 0) {
    // This should normally never happen because you validate on create/update,
    // but it is still correct to fail fast here.
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Template references unknown variables.",
      cause: { unknownVars, referencedVars },
    });
  }

  const missingVars: string[] = [];

  const replaceFn = (_whole: string, key: string) => {
    const value = params.payload[key];

    if (isMissingValue(value)) {
      if (!missingVars.includes(key)) missingVars.push(key);
      // For preview use: keep visible marker. For sending, you may prefer empty string.
      return `⟦MISSING:${key}⟧`;
    }

    return stringifyValue(value);
  };

  const renderedSubject =
    tpl.subjectTemplate == null
      ? null
      : tpl.subjectTemplate.replace(VAR_REGEX, replaceFn);

  const renderedBody = bodyTemplate.replace(VAR_REGEX, replaceFn);

  if (params.throwOnMissingPayload && missingVars.length > 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Payload is missing required values for this template.",
      cause: { missingVars, referencedVars },
    });
  }

  return {
    template: {
      id: tpl.id,
      schoolId: tpl.schoolId,
      sourceType: String(tpl.sourceType),
      channel: String(tpl.channel),
      locale: tpl.locale,
      name: tpl.name,
    },
    subject: renderedSubject,
    body: renderedBody,
    diagnostics: {
      referencedVars,
      missingVars,
      unknownVars: [],
    },
  };
}
