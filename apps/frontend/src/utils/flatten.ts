// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function flattenObject(obj: any): string[] {
  const values: string[] = [];

  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      const childValues = flattenObject(obj[key]);
      if (childValues.length > 0) {
        values.push(childValues.join(" "));
      }
    } else {
      values.push(obj[key]);
    }
  }

  return values;
}
