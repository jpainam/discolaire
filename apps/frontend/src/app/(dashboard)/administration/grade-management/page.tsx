import Link from "next/link";

import { routes } from "~/configs/routes";

export default function Page() {
  return (
    <div>
      <Link href={routes.administration.grade_management.appreciations}>
        Apreciations
      </Link>
    </div>
  );
}
