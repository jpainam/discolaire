import parser from "cron-parser";

export function isValidCron(cron: string): boolean {
  try {
    parser.parseExpression(cron);
    return true;
  } catch {
    return false;
  }
}
