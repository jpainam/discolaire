/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import path from "path";

function _getFileSource() {
  const err = new Error();
  const stack = err.stack?.split("\n")[3]; // Get caller line
  if (!stack) return "";
  const match = /\((.*):(\d+):\d+\)/.exec(stack);
  if (!match) return "";
  const filePath = match[1];
  const line = match[2];
  return `${path.basename(filePath ?? "")}:${line}`;
}

function timestamp() {
  return new Date().toISOString();
}

export const logger = {
  log: (...args: any[]) => {
    const source = ""; //getFileSource();
    console.log(`\x1b[36m[LOG] ${timestamp()} ${source}\x1b[0m`, ...args); // cyan
  },
  warn: (...args: any[]) => {
    const source = ""; //getFileSource();
    console.warn(`\x1b[33m[WARN] ${timestamp()} ${source}\x1b[0m`, ...args); // yellow
  },
  error: (...args: any[]) => {
    const source = ""; //getFileSource();
    console.error(`\x1b[31m[ERROR] ${timestamp()} ${source}\x1b[0m`, ...args); // red
  },
};
