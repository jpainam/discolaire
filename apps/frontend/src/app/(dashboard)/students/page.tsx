import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Link href="/students/123">A link to the </Link>
      {Array.from({ length: 24 }).map((_, index) => (
        <div
          key={index}
          className="aspect-video h-12 w-full rounded-lg bg-muted/50"
        />
      ))}
    </div>
  );
}
