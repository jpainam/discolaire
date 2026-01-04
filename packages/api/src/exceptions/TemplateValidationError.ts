import { extractTemplateVars } from "../services/notification-service";

export class TemplateValidationError extends Error {
  constructor(
    message: string,
    public details: { missingVars: string[]; referencedVars: string[] },
  ) {
    super(message);
  }
}

export function validateTemplateReferences(params: {
  allowed: { key: string }[];
  subjectTemplate: string | null;
  bodyTemplate: string;
}) {
  const subjectVars = extractTemplateVars(params.subjectTemplate);
  const bodyVars = extractTemplateVars(params.bodyTemplate);
  const referencedVars = new Set([...subjectVars, ...bodyVars]);

  if (referencedVars.size === 0) {
    return { referencedVars, missingVars: [] };
  }

  const allowedSet = new Set(params.allowed.map((v) => v.key));

  const missingVars = Array.from(referencedVars).filter(
    (v) => !allowedSet.has(v),
  );

  if (missingVars.length > 0) {
    throw new TemplateValidationError(
      "Template references unknown variables.",
      {
        missingVars,
        referencedVars: Array.from(referencedVars),
      },
    );
  }

  return { referencedVars, missingVars };
}
