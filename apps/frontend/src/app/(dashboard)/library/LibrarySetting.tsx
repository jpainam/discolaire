"use client";

import { BookCategory } from "./BookCategory";

export function LibrarySetting() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <BookCategory />
    </div>
  );
}
