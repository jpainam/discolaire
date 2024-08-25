"use client";

import { Input } from "@repo/ui/input";

import { DateTimePicker } from "~/components/shared/date-time-picker";

export default function AdminPage() {
  return (
    <div>
      <h1>Admin Page</h1>
      <DateTimePicker
        onChange={(val) => {
          console.log(val);
        }}
      />
      <Input type="datetime-local" placeholder="Enter your name" />
    </div>
  );
}
