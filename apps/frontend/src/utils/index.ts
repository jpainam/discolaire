/* eslint-disable @typescript-eslint/no-explicit-any */
import { decode } from "entities";
/**
 * Formats a number to a string representation with support for million (M) and billion (B) abbreviations.
 * @param {number} value - The number to be formatted.
 * @returns {string} - The formatted string.
 */
export function formatNumber(value: number): string {
  // Check if the value is less than 0
  if (value < 0) {
    // Handle negative values separately and format the absolute value
    const absoluteValue = Math.abs(value);
    return `-${formatNumber(absoluteValue)}`;
  } else if (value >= 1e9) {
    // Format the value in billions
    const formattedValue = value / 1e9;
    return `${formattedValue.toFixed(1)}B`;
  } else if (value >= 1e6) {
    // Check if the value is between 1 million and 1 billion
    // Format the value in millions
    const formattedValue = value / 1e6;
    return `${formattedValue.toFixed(1)}M`;
  } else if (value >= 1000) {
    // Check if the value is between 1 thousand and 1 million
    // Format the value in thousands
    const formattedValue = value / 1000;
    return `${formattedValue.toFixed(1)}K`;
  } else {
    // If the value is less than 1 thousand, return the original value as a string
    return value.toString();
  }
}

type Person = {
  firstName?: string | null;
  lastName?: string | null;
  middleName?: string | null;
} & Record<string, any>;

export function getFullName(pperson?: any): string {
  if (!pperson) {
    return "";
  }
  const person = pperson as Person;
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
  return decode(fullName);
}

/**
 *
 * @param person
 * @param part  > 0 1..n (n = length of name parts)
 * @returns
 */
export function getNameParts(person: Person, part: number) {
  const v = getFullName(person);
  const tabs = v.split(" ").filter((s) => s.length > 0);
  if (tabs.length > part) {
    return tabs[part - 1] ?? "";
  }
  return v;
}

export function getAge(date: string | Date | null | undefined) {
  if (!date) {
    return "";
  }
  const dob = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - dob.getTime();
  const age = new Date(diff);
  return Math.abs(age.getUTCFullYear() - 1970);
}

export function isAnniversary(dateOfBirth: Date): boolean {
  const currentDate = new Date();
  return (
    dateOfBirth.getMonth() === currentDate.getMonth() &&
    dateOfBirth.getDate() === currentDate.getDate()
  );
}
