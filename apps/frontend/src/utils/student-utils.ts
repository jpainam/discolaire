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
