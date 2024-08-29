export const avatars = [
  "/avatars/avatar-01.webp",
  "/avatars/avatar-02.webp",
  "/avatars/avatar-03.webp",
  "/avatars/avatar-04.webp",
  "/avatars/avatar-05.webp",
  "/avatars/avatar-06.webp",
  "/avatars/avatar-07.webp",
  "/avatars/avatar-08.webp",
  "/avatars/avatar-09.webp",
  "/avatars/avatar-10.webp",
  "/avatars/avatar-11.webp",
  "/avatars/avatar-12.webp",
  "/avatars/avatar-13.webp",
  "/avatars/avatar-14.webp",
  "/avatars/avatar-15.webp",
];

export function randomAvatar(pos?: number): string {
  if (pos != undefined) {
    return avatars[pos % avatars.length] ?? "/avatars/avatar-01.webp";
  } else {
    return (
      avatars[Math.floor(Math.random() * avatars.length)] ??
      "/avatars/avatar-01.webp"
    );
  }
}
