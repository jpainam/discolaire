"use client";

import { useMemo } from "react";
import { initials as dicebearInitials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

function normalizeKey(key: string) {
  // tolerate "/student/..." from legacy data
  return key.replace(/^\/+/, "");
}

function getInitials(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AV";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  const initials = (first + last).toUpperCase();
  return initials || "AV";
}

export function UserAvatar(props: {
  name: string;
  photoKey?: string | null;
  className?: string;
  alt?: string;
  fallbackText?: string;
}) {
  const { name, photoKey, className, alt = "", fallbackText } = props;

  const src = useMemo(() => {
    if (!photoKey) return undefined;
    const key = normalizeKey(photoKey);
    return `/api/avatars/${key}`;
  }, [photoKey]);

  const fallbackDataUri = useMemo(() => {
    const svg = createAvatar(dicebearInitials, {
      seed: name,
    });
    return svg.toDataUri();
  }, [name]);

  const initials = useMemo(() => getInitials(name), [name]);

  return (
    <Avatar className={className}>
      <AvatarImage
        className="object-cover"
        src={src ?? fallbackDataUri}
        alt={alt}
      />
      <AvatarFallback className="bg-muted text-muted-foreground flex items-center justify-center rounded-full font-medium">
        {fallbackText ?? initials}
      </AvatarFallback>
    </Avatar>
  );
}
