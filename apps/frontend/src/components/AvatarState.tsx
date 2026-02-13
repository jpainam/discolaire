import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";
import { ImageZoom } from "./ImageZoom";

interface AvatarStateProps {
  avatar?: string | null;
  className?: string;
  pos?: number;
  name?: string | null;
  alt?: string;
  fallbackText?: string;
  avatarBasePath?: string;
  zoomable?: boolean;
}

function getInitials(value?: string | null) {
  const parts = (value ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AV";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  const text = `${first}${last}`.toUpperCase();
  return text || "AV";
}

function normalizeAvatarSrc(avatar: string, avatarBasePath: string): string {
  if (
    avatar.startsWith("http://") ||
    avatar.startsWith("https://") ||
    avatar.startsWith("data:") ||
    avatar.startsWith("blob:") ||
    avatar.startsWith("/")
  ) {
    return avatar;
  }
  return `${avatarBasePath.replace(/\/$/, "")}/${avatar.replace(/^\/+/, "")}`;
}

export function AvatarState({
  avatar,
  className,
  pos,
  name,
  alt,
  fallbackText,
  avatarBasePath = "/api/download/avatars",
  zoomable = true,
}: AvatarStateProps) {
  const normalizedName = name?.trim();
  const seed =
    normalizedName && normalizedName.length > 0
      ? normalizedName
      : (avatar ?? (pos != undefined ? String(pos) : "AV"));
  const fallbackDataUri = createAvatar(initials, {
    seed,
    scale: 75,
  }).toDataUri();
  const src = avatar
    ? normalizeAvatarSrc(avatar, avatarBasePath)
    : fallbackDataUri;
  const content = (
    <Avatar
      size="sm"
      className={cn("my-0 h-8 w-8", zoomable && "cursor-pointer", className)}
    >
      <AvatarImage src={src} alt={alt ?? getInitials(name)} />
      <AvatarFallback>{fallbackText ?? getInitials(name)}</AvatarFallback>
    </Avatar>
  );

  if (!zoomable) {
    return content;
  }

  return <ImageZoom>{content}</ImageZoom>;
}
