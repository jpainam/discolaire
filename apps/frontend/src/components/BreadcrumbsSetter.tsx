"use client";

import { useEffect } from "react";

import type { BreadcrumbItem } from "~/stores/breadcrumbs";
import { useBreadcrumbsStore } from "~/stores/breadcrumbs";

export function BreadcrumbsSetter({ items }: { items: BreadcrumbItem[] }) {
  const setItems = useBreadcrumbsStore((s) => s.setItems);
  const reset = useBreadcrumbsStore((s) => s.reset);

  useEffect(() => {
    setItems(items);
    return () => reset(); // important so breadcrumbs don't "stick" when you leave the route
  }, [items, setItems, reset]);

  return null;
}
