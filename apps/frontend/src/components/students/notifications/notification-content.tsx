"use client";

import { useParams } from "next/navigation";

export function NotificationContent() {
  const params = useParams();

  return <div>List of notifications</div>;
}
