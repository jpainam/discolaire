"use client";

import { BookCategory } from "./BookCategory";

export function LibrarySetting() {
  return (
    <div className="grid md:grid-cols-3 gap-4 px-4">
      <BookCategory />
    </div>
  );
}
