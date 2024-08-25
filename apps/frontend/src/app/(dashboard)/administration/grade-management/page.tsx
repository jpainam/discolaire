import { routes } from "@/configs/routes";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <Link href={routes.administration.grade_management.appreciations}>
        Apreciations
      </Link>
    </div>
  );
}
