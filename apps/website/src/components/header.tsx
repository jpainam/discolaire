import { cn } from "../lib/utils";

export function Header() {
  return (
    <header
      className={cn("sticky top-4 z-50 mt-4 justify-center md:flex md:px-4")}
    >
      <nav></nav>
    </header>
  );
}
