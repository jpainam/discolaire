export function getFullName(person: any): string {
  if (!person) {
    return "";
  }
  let fullName = "";
  if ("lastName" in person && person.lastName) {
    fullName += " " + person.lastName;
  }
  if ("middleName" in person && person.middleName) {
    fullName += " " + person.middleName;
  }
  if ("firstName" in person && person.firstName) {
    fullName += " " + person.firstName;
  }
  return fullName;
}

/**
 *
 * @param person
 * @param part  > 0 1..n (n = length of name parts)
 * @returns
 */
export function getNameParts(person: any, part: number) {
  const v = getFullName(person);
  const tabs = v.split(" ").filter((s) => s.length > 0);
  if (tabs.length > part) {
    return tabs[part - 1];
  }
  return v;
}
